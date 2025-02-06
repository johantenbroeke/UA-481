function (entityIds, toolpathBlock, toolpathIndex, createTransactionGroup, updateConnections, isNew) {
    if (isNull(toolpathBlock)) {
        qWarning("no toolpath block");
        return [];
    }
    this.currentToolpathBlock = toolpathBlock;
    // give exporters a chance to do something before the toolpath is exported
    // e.g. updating another toolpath (drill toolpath before profile toolpath):
    var doContinue = this.beforeExportToolpath(entityIds, toolpathBlock, toolpathIndex, createTransactionGroup, updateConnections, isNew);
    if (doContinue===false) {
        // nothing to be done:
        return [];
    }
    // no entity IDs given, update toolpath based on entity IDs
    // stored in toolpath block (attached to copies of original entities):
    if (isNull(entityIds)) {
        entityIds = Cam.getToolpathEntityIds(toolpathBlock);
    }
    if (entityIds.length===0) {
        this.warnUser(qsTranslate('CamExporterV2', "No source entities found. Aborting..."));
        //Cam.setExporter(undefined);
        return [];
    }
    // remove deleted entities from list:
    // remove tab blocks from list:
    var entityIdsNew = [];
    for (var i=0; i<entityIds.length; i++) {
        var entityId = entityIds[i];
        var e = this.cadDocument.queryEntityDirect(entityId);
        if (isNull(e) || e.isUndone()) {
            continue;
        }
        if (e.getCustomBoolProperty("QCAD", "CamTabFlag", false)===true) {
            // ignore tab blocks:
            continue;
        }
        entityIdsNew.push(entityId);
    }
    if (entityIdsNew.length===0) {
        this.notifyUser(qsTranslate('CamExporterV2', "All source entities for this toolpath have vanished. Aborting..."));
        return [];
    }
    entityIds = this.cadDocument.getStorage().orderBackToFront(entityIdsNew);
    // detect special case of single polyline with given direction:
    var directionFromEntity = false;
    if (entityIds.length===1) {
        var contourEntity = this.camDocument.queryEntityDirect(entityIds[0]);
        if (isPolylineEntity(contourEntity)) {
            var dir = contourEntity.getCustomProperty("QCAD", "CamDirection", undefined);
            if (!isNull(dir)) {
                qDebug("single polyline with fixed dir");
                directionFromEntity = true;
            }
        }
    }
    // build array of all contours in desired orientation:
    this.notifyUser(qsTranslate('CamExporterV2', "Identifying contours..."));
    this.incIndent();
    var contours = [];
    var collector = new ContourCollector(this.cadDocument);
    collector.limitToEntityIds = true;
    // limit exported contours to 2 for trial:
    var pluginInfo = RPluginLoader.getPluginInfo("CAM");
    if (!isNull(pluginInfo.get("TrialExpired", undefined))) {
        collector.limit = 2;
    }
    var toolType = this.getCurrentToolType();
    var toolpathType = this.getCurrentToolpathType();
    var useDrill = (this.isDrillTool(toolType) || toolpathType===Cam.ToolpathType.Drill);
    collector.onlyPointsAndCircles = useDrill;
    collector.side = this.getSide();
    collector.dir = this.getDirection();
    collector.tolerance = this.getTolerance();
    collector.splitFullCircles = this.getSplitFullCircles();
    var self = this;
    collector.notifyUser = function(msg) {
        self.notifyUser(msg);
    }
    collector.contourFactory = function(doc) {
        return new ContourV2(doc, self);
    };
    if (directionFromEntity) {
        collector.noReverse = true;
    }
    this.initCollector(collector);
    //collector.incIndent = this.incIndent;
    //collector.decIndent = this.decIndent;
    //collector.indent = this.indent;
    //collector.progressDialog = this.progressDialog;
    contours = collector.collectContours(entityIds);
    this.decIndent();
    if (contours.length===0) {
        this.notifyUser(qsTranslate('CamExporterV2', "No contours found for this toolpath. Aborting..."));
        //Cam.setExporter(undefined);
        return [];
    }
    // export each individual contour into separate toolpath:
    if ((this.oneToolpathPerContourProfile===true && !useDrill) ||
        (this.oneToolpathPerContourDrill===true && useDrill)) {
        this.notifyUser(qsTranslate('CamExporterV2', "Exporting %1 toolpaths for %1 contours").arg(contours.length));
        this.incIndent();
        var order = Cam.getToolpathOrder(toolpathBlock, "0");
        if (this.currentToolpathBlock.getCustomProperty("QCAD", "CamManualOrder")==="1") {
//            qDebug("export in manual order");
            contours.sort(function(a,b) {
                return a.manualOrder-b.manualOrder;
            });
            // manual order by drawing order:
//            for (k=0; k<contours.length; k++) {
//                this.exportContour(contours, k, 0);
//            }
        }
        // base name for new toolpaths:
        var toolpathBlockBaseName = toolpathBlock.getName();
        var toolpathBlockNameN;
        var op;
        // keep a copy of the original toolpath block created by QCAD/CAM,
        // to copy custom attributes to new toolpath blocks:
        var originalToolpathBlock = toolpathBlock.clone();
        for (var k=0; k<contours.length; k++) {
            // remove toolpath block already created by QCAD/CAM:
            if (k===0 && contours.length>1) {
                op = new RDeleteObjectOperation(toolpathBlock);
                op.setAllowInvisible(true);
                op.setAllowAll(true);
                op.setTransactionGroup(this.camDocument.getTransactionGroup());
                op.setText(qsTranslate('CamExporterV2', "Remove toolpath block"));
                this.camDocumentInterface.applyOperation(op);
            }
            var contour = contours[k];
            // single contour is exported to toolpath block with given name:
            toolpathBlockNameN = toolpathBlockBaseName;
            if (contours.length>1) {
                // contours are exported to toolpath blocks with given name + counter:
                toolpathBlockNameN = toolpathBlockNameN + " " + (k+1);
            }
            var toolpathBlockN = this.camDocument.queryBlock(toolpathBlockNameN);
            if (isNull(toolpathBlockN)) {
                // create sub toolpath block with name <toolpath block name>_N
                // order is same as original (single contour) or increased (multiple contours):
                //toolpathBlockN = Cam.createToolpathBlock(this.camDocument, toolpathBlockNameN, order + k + 1);
                toolpathBlockN = Cam.createToolpathBlock(this.camDocument, toolpathBlockNameN);
            }
            // save order (will be overwritten from toolpathBlock):
            var orderBak = parseInt(Cam.getToolpathOrder(toolpathBlockN, "0"));
            toolpathBlockN.copyCustomPropertiesFrom(originalToolpathBlock, "QCAD");
            // contour contains single polyline with CamSide override:
            if (directionFromEntity) {
                toolpathBlockN.setCustomProperty("QCAD", "CamDirection", dir);
            }
            // add toolpath block:
            op = new RAddObjectOperation(toolpathBlockN);
            op.setAllowInvisible(true);
            op.setAllowAll(true);
            op.setTransactionGroup(this.camDocument.getTransactionGroup());
            op.setText(qsTranslate('CamExporterV2', "Add toolpath block"));
            this.camDocumentInterface.applyOperation(op);
            // refresh pointer to represent already added object:
            toolpathBlockN = this.camDocument.queryBlock(toolpathBlockNameN);
            this.exportToolpathContours([contour], toolpathBlockN, toolpathIndex, createTransactionGroup, updateConnections, isNew);
            // restore overwritten order:
            Cam.setToolpathOrder(toolpathBlockN, orderBak);
        }
        this.decIndent();
    }
    else {
        this.exportToolpathContours(contours, toolpathBlock, toolpathIndex, createTransactionGroup, updateConnections, isNew);
    }
    // give exporters a chance to do something after the toolpath is exported
    // e.g. updating another linked toolpath (drill toolpath before profile toolpath):
    this.afterExportToolpath(entityIds, toolpathBlock, toolpathIndex, createTransactionGroup, updateConnections, isNew);
    return [];
}
