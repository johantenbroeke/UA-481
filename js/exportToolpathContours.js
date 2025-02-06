function (contours, toolpathBlock, toolpathIndex, createTransactionGroup, updateConnections, isNew) {
    if (isNull(toolpathBlock)) {
        qWarning("no toolpath block");
        return;
    }
    if (isNull(createTransactionGroup)) {
        createTransactionGroup = true;
    }
    if (isNull(updateConnections)) {
        updateConnections = true;
    }
    if (isNull(isNew)) {
        isNew = false;
    }
    if (createTransactionGroup===true) {
        this.camDocument.startTransactionGroup();
    }
    var op, i, e, entityId;
    var toolpathBlockId = toolpathBlock.getId();
    // create CAM output layers:
    var outConfigLayerName = this.createConfigOutputLayer();
    // create layer "CAM ... GCode ... source"
    var outSourceLayerId = this.createLayer(outConfigLayerName + RLayer.getHierarchySeparator() + "source",
                                            new RColor("white"), undefined, { "off" : true });
    this.currentToolpathBlock = toolpathBlock;
    var toolType = this.getCurrentToolType();
    var toolpathName = Cam.getToolpathName(toolpathBlock.getName());
    this.notifyUser(qsTranslate('CamExporterV2', "Generating toolpath \"%1\"").arg(toolpathName));
    var toolName = Cam.getToolpathToolName(toolpathBlock);
    //var toolName = this.getToolName();
    this.notifyUser(qsTranslate('CamExporterV2', "Tool \"%1\"").arg(toolName));
    // empty the toolpath block:
    this.notifyUser(qsTranslate('CamExporterV2', "Purging toolpath block..."));
    this.incIndent();
    var toolpathEntityIds = this.camDocument.queryBlockEntities(toolpathBlockId);
    op = new RDeleteObjectsOperation();
    op.setAllowInvisible(true);
    op.setAllowAll(true);
    op.setTransactionGroup(this.camDocument.getTransactionGroup());
    op.setText("Delete all entities in toolpath block");
    for (i=0; i<toolpathEntityIds.length; i++) {
        var toolpathEntityId = toolpathEntityIds[i];
        e = this.camDocument.queryEntity(toolpathEntityId);
        op.deleteObject(e);
    }
    this.camDocumentInterface.applyOperation(op);
    this.decIndent();
    // copy all original entities into toolpath block and
    // link copies back to originals (for recomputations)
    this.notifyUser(qsTranslate('CamExporterV2', "Copying source entities..."));
    this.incIndent();
//    // if CamSourceLayer is set to a layer name, drop all entities NOT
//    // on that layer:
//    var sourceLayerName = toolpathBlock.getCustomProperty("QCAD", "CamSourceLayer", "");
//    var sourceLayerId = this.cadDocument.getLayerId(sourceLayerName);
    op = new RAddObjectsOperation();
    op.setAllowInvisible(true);
    op.setAllowAll(true);
    op.setTransactionGroup(this.camDocument.getTransactionGroup());
    op.setText("Copy toolpath source entities into toolpath block");
    var toolDiameter = Cam.getToolpathToolDiameter(this.cadDocument, this.currentToolpathBlock, true, undefined);
    for (var k=0; k<contours.length; k++) {
        var contour = contours[k];
        for (i=0; i<contour.entityIds.length; i++) {
            entityId = contour.entityIds[i];
            e = this.cadDocument.queryEntity(entityId);
            if (e.isUndone()) {
                continue;
            }
//            if (e.getCustomBoolProperty("QCAD", "CamTabFlag", false)===true) {
//                 ignore tab blocks:
//                continue;
//            }
//        // drop entities on other layers when regenerating toolpath
//        // created from layer with CAM properties:
//        if (sourceLayerId!==-1 && sourceLayerId!==e.getLayerId()) {
//            continue;
//        }
            e.setDocument(this.camDocument);
            e.setBlockId(toolpathBlockId);
            e.setLayerId(outSourceLayerId);
            e.setSelected(false);
            e.setCustomProperty("QCAD", "CamSourceHandle", e.getHandle().toString(16));
            e.setCustomProperty("QCAD", "CamIgnore", "1");
            e.setDrawOrder(this.drawOrder++);
            op.addObject(e, false, true);
        }
        // for drill toolpaths only:
        // create circles with tool diameter for each drill hole:
        if (this.isDrillTool(toolType)) {
            // create layer "CAM ... GCode ... drill"
            var outDrillLayerId = this.createLayer(outConfigLayerName + RLayer.getHierarchySeparator() + "drill",
                                                    new RColor("yellow"), undefined, { "off" : false });
            for (i=0; i<contour.shapes.length; i++) {
                var shape = contour.shapes[i];
                if (isPointShape(shape)) {
                    var pos = shape.getPosition();
                    var zStartDepth = this.getToolpathOptionFloat("CamZStartDepth", 0.0);
                    var zDrillingDepth = this.getToolpathOptionFloat("CamZDrillingDepth", 0.0);
                    pos.z = -(zStartDepth+zDrillingDepth);
                    e = new RCircleEntity(this.cadDocument, new RCircleData(pos, toolDiameter/2));
                    e.setBlockId(toolpathBlockId);
                    e.setLayerId(outDrillLayerId);
                    e.setCustomProperty("QCAD", "CamIgnore", "1");
                    e.setCustomProperty("QCAD", "CamDrillHole", "1");
                    //e.setDrawOrder(this.drawOrder++);
                    op.addObject(e, false, true);
                }
            }
        }
    }
    this.camDocumentInterface.applyOperation(op);
    this.decIndent();
    // previous / next toolpath:
    var prevToolpathBlock = Cam.getPrevToolpathBlock(this.currentToolpathBlock);
    var nextToolpathBlock = Cam.getNextToolpathBlock(this.currentToolpathBlock);
//    if (contours.length===0) {
//        this.notifyUser(qsTranslate('CamExporterV2', "No contours found for this toolpath. Aborting..."));
//        //Cam.setExporter(undefined);
//        return;
//    }
    var appWin = EAction.getMainWindow();
    if (!isNull(appWin)) {
        appWin.disable();
    }
    // initialize contours with toolpath properties:
    this.notifyUser(qsTranslate('CamExporterV2', "Initializing contours from toolpath properties..."));
    for (i=0; i<contours.length; i++) {
        if (toolpathBlock.getCustomProperty("QCAD", "CamUseStartOfPolyline", "0")==="1") {
            //qDebug("useStartOfPolyline");
            contours[i].useStartOfPolyline = true;
        }
    }
    // compute nesting degree for islands (even) and holes (odd)
    if (!this.isDrillTool(toolType)) {
        this.notifyUser(qsTranslate('CamExporterV2', "Computing nesting degrees..."));
        ContourV2.computeNestingDegree(contours, this.getSide(), this.getTolerance());
    }
//    for (i=0; i<contours.length; i++) {
//        qDebug("contour: ", contours[i]);
//    }
    // create spatial index over contour entry points:
    this.notifyUser(qsTranslate('CamExporterV2', "Creating spatial index..."));
    this.incIndent();
    var siEntryPoints = this.createSpatialIndex(contours);
    this.decIndent();
    // operation used by exportCamEntity, etc.:
    this.op = new RAddObjectsOperation();
    this.op.setAllowInvisible(true);
    this.op.setAllowAll(true);
    this.op.setTransactionGroup(this.camDocument.getTransactionGroup());
    this.op.setText(qsTranslate('CamExporterV2', "Export toolpath"));
    this.op.setSpatialIndexDisabled(true);
    // initialize start point of toolpath:
    this.cursor = undefined;
    this.toolPosition = CamExporterV2.ToolPosition.Safety;
    // is this the first toolpath:
    var firstToolpath = isNull(prevToolpathBlock);
    // is this the last toolpath:
    var lastToolpath = isNull(nextToolpathBlock);
    if (!isNull(prevToolpathBlock)) {
        // not the first toolpath: start point is end point of previous toolpath:
        var c = Cam.getToolpathEndPoint(prevToolpathBlock);
        if (!isNull(c)) {
            this.cursor = c;
            if (Cam.getToolpathToolName(this.currentToolpathBlock)!==Cam.getToolpathToolName(prevToolpathBlock)) {
                // different tool:
                // tool position is at safety level:
                this.toolPosition = CamExporterV2.ToolPosition.Safety;
            }
            else {
                // same tool:
                // tool position is at tool up:
                this.toolPosition = CamExporterV2.ToolPosition.Clearance;
            }
            //this.previousTool = Cam.getToolpathToolName(prevToolpathBlock);
        }
    }
    if (isNull(this.cursor)) {
        // position is not known (before first toolpath)
        // assume home:
        this.cursor = this.getHome();
    }
    if (firstToolpath) {
        this.unknownPosition = true;
    }
    // if toolpath index not given by caller, find it out here (slow):
    if (isNull(toolpathIndex)) {
        var tpBlocks = Cam.getToolpathBlocks(this.camDocument);
        for (var t=0; t<tpBlocks.length; t++) {
            var tpBlock = tpBlocks[t];
            if (tpBlock.getId()===toolpathBlock.getId()) {
                toolpathIndex = t;
                break;
            }
        }
    }
    if (isNull(toolpathIndex)) {
        toolpathIndex = 0;
    }
    toolpathBlock.setCustomProperty("QCAD", "CamToolpathIndex", toolpathIndex.toString());
    toolpathBlock.setCustomProperty("QCAD", "CamContourCount", contours.length.toString());
    // copy properties of layer if this toolpath is linked to a layer:
    var sourceLayerName = toolpathBlock.getCustomProperty("QCAD", "CamSourceLayer", "");
    var sourceLayerId = this.cadDocument.getLayerId(sourceLayerName);
    if (sourceLayerId!==RObject.INVALID_ID) {
        var sourceLayer = this.cadDocument.queryLayerDirect(sourceLayerId);
        if (!isNull(sourceLayer)) {
            var className = this.getConfigName();
            toolpathBlock.copyCustomPropertiesFrom(sourceLayer.data(), "QCAD", true, [], "Cam/" + className + "/", "");
        }
    }
    this.op.addObject(toolpathBlock);
    // process contours using shortest path:
    this.notifyUser(qsTranslate('CamExporterV2', "Processing %n contour(s)", "", contours.length));
    this.incIndent();
    this.exportContours(contours, siEntryPoints);
    this.decIndent();
    // end of toolpath:
    // retreat to safety if tool will change for next toolpath:
    if (!isNull(nextToolpathBlock)) {
        var nextTool = Cam.getToolpathToolName(nextToolpathBlock);
        if (!isNull(nextTool)) {
            if (nextTool!==toolName) {
                // retreat to safety level of this or next tool,
                // whichever is higher (=safer)
                var toolSafetyLevel = this.getSafetyLevel();
                var nextToolSafetyLevel = this.getSafetyLevel(nextTool);
                if (nextToolSafetyLevel>toolSafetyLevel) {
                    this.exportToolUpSafety(nextTool);
                }
                else {
                    this.exportToolUpSafety();
                }
            }
            else {
                // export dummy retreat (zero length line):
                // this can be extended if situation changes:
                this.exportToolUpSafetyDummy();
            }
        }
    }
    else {
        // for last toolpath, always retreat to safety:
        this.exportToolUpSafety();
    }
    // update connection of previous and next toolpath to this toolpath:
    if (updateConnections) {
        if (!isNull(prevToolpathBlock)) {
            Cam.updateToolpathEndPoint(this.op, prevToolpathBlock);
        }
        if (!isNull(nextToolpathBlock)) {
            Cam.updateToolpathStartPoint(this.op, nextToolpathBlock, this.cursor);
        }
    }
    // add entities to toolpath block:
    this.camDocumentInterface.applyOperation(this.op);
    this.op = undefined;
    // insert block if no block references exist already:
    var refIds = this.camDocument.queryBlockReferences(toolpathBlockId);
    if (refIds.length===0) {
        var blockReference = new RBlockReferenceEntity(
            this.camDocument,
            new RBlockReferenceData(
                toolpathBlockId,
                new RVector(0,0),
                new RVector(1,1,1),
                0.0
            )
        );
        blockReference.setLayerName(outConfigLayerName);
        op = new RAddObjectOperation(blockReference, false);
        op.setAllowInvisible(true);
        op.setAllowAll(true);
        op.setTransactionGroup(this.camDocument.getTransactionGroup());
        op.setText(qsTranslate('CamExporterV2', "Insert toolpath block"));
        this.camDocumentInterface.applyOperation(op);
    }
    this.currentToolpathBlock = undefined;
    if (!isNull(appWin)) {
        appWin.enable();
    }
}
