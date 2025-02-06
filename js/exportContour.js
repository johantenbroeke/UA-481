function (contours, contourIndex, shapeIndex, siEntryPoints, inner) {
    if (isNull(inner)) {
        inner = false;
    }
    var contour = contours[contourIndex];
    var k, p;
    var lastContour = false;
    // remove contour entry points from spatial index:
    if (!isNull(siEntryPoints)) {
        var entryPoints = contour.getEntryPoints();
        for (k=0; k<entryPoints.length; k++) {
            p = entryPoints[k];
            if (isValidVector(p)) {
                siEntryPoints.removeFromIndex(contourIndex, k, new RBox(p, 0.0));
            }
        }
    }
    // export smaller contours inside the current contour first
    // TODO: make this a toolpath option
    //if (!isNull(siEntryPoints) && !lastContour) {
    if (!isNull(siEntryPoints)) {
        var done;
        do {
            done = true;
            var bbox = contour.getBoundingBox();
            bbox.grow(-this.getTolerance());
            var visitor = new InsideVisitor(this, contour, this.cursor);
            // query entry points of other contours that potentionally
            // lay inside this contour:
            siEntryPoints.queryContained(bbox.getMinimum().x, bbox.getMinimum().y, bbox.getMinimum().z,
                                         bbox.getMaximum().x, bbox.getMaximum().y, bbox.getMaximum().z, visitor);
            //if (!isNull(visitor.contourId)) {
            for (var h=0; h<visitor.contourIds.length; h++) {
                // check bounding boxes:
                // entry point of contour might be inside bounding box of other contour,
                // but contour is outside other contour:
                var innerContourId = visitor.contourIds[h];
                var innerContour = contours[innerContourId];
                var innerBbox = innerContour.getBoundingBox();
                if (bbox.contains(innerBbox)) {
                    //var contourInner = contours[visitor.contourId];
                    this.notifyUser(qsTranslate('CamExporterV2', "Processing contour %1 (inside contour %2)").arg(innerContourId).arg(contourIndex));
                    this.incIndent();
                    this.exportContour(contours, innerContourId, visitor.pos, siEntryPoints, true);
                    this.decIndent();
                    done = false;
                    break;
                }
            }
        } while (!done);
    }
    // check if this is the last contour:
    if (!isNull(siEntryPoints) && !inner) {
        var ssidNext = siEntryPoints.queryNearestNeighbor(0.0, 0.0, 0.0);
        var contourIndexNext = ssidNext[0];
        var shapeIndexNext = ssidNext[1];
        if (contourIndexNext===-1 || shapeIndexNext===-1) {
            lastContour = true;
        }
    }
    // export contour:
    this.pushContext([ "CamContourIndex", contourIndex.toString() ]);
    this.pushContext([ "CamCuttingContour", "1" ]);
    if (this.firstContour) {
        this.pushContext([ "CamFirstContour", "1" ]);
    }
    if (lastContour) {
        this.pushContext([ "CamLastContour", "1" ]);
    }
    var contourOri = contour.getOrientation();
    if (contourOri===RS.Any) {
        this.warnUser(qsTranslate('CamExporterV2', "Undefined contour orientation"));
    }
    this.notifyUser(qsTranslate('CamExporterV2', "Contour orientation:") + " " +
                    (contourOri===RS.CW ? qsTranslate('CamExporterV2', "Clockwise") : qsTranslate('CamExporterV2', "Counter-Clockwise")));
    if (contour.isHole()) {
        this.notifyUser(qsTranslate('CamExporterV2', "Contour is a hole."));
    }
    // get Z stepping parameters:
    var zSafety = this.getToolpathOptionFloat("CamZSafety", undefined);
    var zClearance = this.getToolpathOptionFloat("CamZClearance", undefined);
    this.zClearancePass = zClearance;
    var zStartDepth = this.getToolpathOptionFloat("CamZStartDepth", undefined);
    var zCuttingDepth = this.getToolpathZCuttingDepth();
    var zPasses = this.getToolpathOptionFloat("CamZPasses", undefined);
    // no Z passes / single pass:
    // still use passes parameters for clearance / cutting levels if available:
    if (isNull(zStartDepth) || isNull(zClearance) ||
        isNull(zCuttingDepth) || isNull(zPasses) || zPasses===1) {
        this.pushContext([ "CamZPasses", "1" ]);
        this.pushContext([ "CamZPass", "1" ]);
        this.pushContext([ "CamZPassIndex", "0" ]);
        this.notifyUser(qsTranslate('CamExporterV2', "Processing contour in single pass."));
        if (!isNull(zClearance)) {
            this.setZClearanceLevelOverride(zClearance);
        }
        else {
            qWarning("zClearance is NULL");
            debugger;
        }
        if (!isNull(zCuttingDepth)) {
            this.setZCuttingLevelOverride(-(zStartDepth+zCuttingDepth));
        }
        else {
            qWarning("zCuttingDepth is NULL");
            debugger;
        }
        //this.exportContourPass(contour, entityIndex);
        this.incIndent();
        //this.zTabLevel = undefined;
        this.exportContourPass(contour, shapeIndex);
        this.decIndent();
        if (!isNull(zClearance)) {
            this.exportToolUp();
        }
        this.popContext([ "CamZPassIndex", "0" ]);
        this.popContext([ "CamZPass", "1" ]);
        this.popContext([ "CamZPasses", "1" ]);
        this.unsetZCuttingLevelOverride();
        this.unsetZClearanceLevelOverride();
    }
    // multiple Z passes:
    else {
        this.notifyUser(qsTranslate('CamExporterV2', "Processing contour in %n passe(s).", "", zPasses));
        var zDelta = (zCuttingDepth - zStartDepth) / zPasses;
        var zFirstDepth = zStartDepth + zDelta;
        qDebug("zPasses", zPasses);
        qDebug("zDelta", zDelta);
        qDebug("zFirstDepth", zFirstDepth);
        qDebug("zCuttingDepth", zCuttingDepth);
        qDebug("zStartDepth", zStartDepth);
        if (Math.abs(zDelta)>1.0e-6) {
            this.pushContext([ "CamZPasses", zPasses.toString() ]);
            this.setZClearanceLevelOverride(zClearance);
            //this.setZClearanceLevelOverride(zSafety);
            var z;
            for (z=zFirstDepth, p=1; z<=zCuttingDepth+0.000001; z+=zDelta, p++) {
                if (z>zCuttingDepth || RMath.fuzzyCompare(z, zCuttingDepth, 0.000002)) {
                    // last cutting level:
                    z = zCuttingDepth;
                }
                //this.setZClearanceLevelOverride(-z + zClearance);
                this.setZCuttingLevelOverride(-z);
                if (p===1 || this.clearancePerPass!==true) {
                    // first pass: use normal clearance:
                    this.zClearancePass = zClearance;
                }
                else {
                    // subsequent passes: previous cutting level + clearance:
                    this.zClearancePass = -z + zDelta + zClearance;
                }
                // initPass might for example set a tool diameter override,
                // based on Z pass:
                this.initPass(p, zPasses);
                this.zTabLevel = undefined;
                this.notifyUser(qsTranslate('CamExporterV2', "Pass %1 at Z%2").arg(p).arg(-z));
                this.incIndent();
                this.pushContext([ "CamZPass", p.toString() ]);
                this.pushContext([ "CamZPassIndex", (p-1).toString() ]);
                this.pushContext([ "CamZClearancePass", this.zClearancePass ]);
                this.exportContourPass(contour, shapeIndex);
                this.popContext([ "CamZClearancePass", this.zClearancePass ]);
                this.popContext([ "CamZPassIndex", (p-1).toString() ]);
                this.popContext([ "CamZPass", p.toString() ]);
                this.decIndent();
                // e.g. optional tool up to safety:
                this.exportPostContourPass(contour);
                this.uninitPass(p, zPasses);
            }
            // make sure we retreat to the Z clearing level of the
            // stepping parameters:
            this.exportPostContourPasses(contour);
            this.unsetZCuttingLevelOverride();
            this.unsetZClearanceLevelOverride();
            this.popContext([ "CamZPasses", zPasses.toString() ]);
        }
        else {
            this.warnUser(qsTranslate('CamExporterV2', "Cutting depth is zero"));
        }
    }
    if (lastContour) {
        this.popContext([ "CamLastContour", "1" ]);
    }
    if (this.firstContour) {
        this.popContext([ "CamFirstContour", "1" ]);
    }
    this.popContext([ "CamCuttingContour", "1" ]);
    this.popContext([ "CamContourIndex", contourIndex.toString() ]);
    this.firstContour = false;
    //this.notifyUser("<a href='#%1'>Contour</a> processed.".arg(contour.getEntityIds().join(",")));
}
