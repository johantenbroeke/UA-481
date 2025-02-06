function (camEntity) {
    var camShape = camEntity.clone().castToShape();
    camShape.to2D();
    // get all tab block references:
    var tabBlockRefs = this.getTabBlockReferences();
    if (tabBlockRefs.length===0) {
        return [];
    }
    var toolDiameter = Cam.getToolpathToolDiameter(this.cadDocument, this.currentToolpathBlock, true, undefined);
    if (!isNumber(toolDiameter)) {
        return [];
    }
    var toolRadius = toolDiameter/2;
    var zFinalLevel = -this.getToolpathZCuttingDepth();
    // for every tab, find tab line and parallels, find split points:
    var ret = [];
    for (var i=0; i<tabBlockRefs.length; i++) {
        var tabBlockRef = tabBlockRefs[i];
        var pos = tabBlockRef.getPosition();
        var a = camShape.getAngleAtPoint(pos) + Math.PI/2;
        var v = RVector.createPolar(toolRadius+0.1, a);
        var tabLine = new RLine(pos.operator_add(v), pos.operator_subtract(v));
        //this.op.addObject(shapeToEntity(this.camDocument, tabLine), false, true);
        var tabLength = tabBlockRef.getCustomDoubleProperty("QCAD", "CamTabLength", 0.0);
        var tabThickness = tabBlockRef.getCustomDoubleProperty("QCAD", "CamTabThickness", 0.0);
        // tab has zero size:
        if (tabLength<0.001 || Math.abs(tabThickness)<0.001) {
            continue;
        }
        // tab does not interrupt entity (tab is lower than current Z cutting level):
        var zTabLevel = zFinalLevel + tabThickness;
        if (camEntity.getStartPoint().z>zTabLevel) {
            if (this.allowNegativeTabs!==true) {
                continue;
            }
        }
//        if (RMath.fuzzyCompare(camEntity.getStartPoint().x, 50.0)) {
//            qDebug("tabLine:", tabLine);
//        }
        var parallels;
        var parallelBefore;
        var parallelAfter;
        if (isArcShape(camShape)) {
            // 'parallel' tab lines (rotated around shape center):
            var pa = ((tabLength+toolDiameter)/2) / (2 * Math.PI * camShape.getRadius()) * (2 * Math.PI);
            var p1 = tabLine.clone();
            p1.rotate(pa, camShape.getCenter());
            var p2 = tabLine.clone();
            p2.rotate(-pa, camShape.getCenter());
            parallels = [p1, p2];
            parallelBefore = parallels[0];
            parallelAfter = parallels[1];
        }
        else {
            // parallels to tab line:
            parallels = tabLine.getOffsetShapes((tabLength+toolDiameter)/2, 1, RS.BothSides);
            parallelBefore = parallels[0].data();
            parallelAfter = parallels[1].data();
        }
//        var dbg = isArcShape(camShape) && camShape.getCenter().equalsFuzzy(new RVector(20,40), 0.1);
//        if (dbg) {
//            this.op.addObject(shapeToEntity(this.camDocument, parallelBefore), false, true);
//            this.op.addObject(shapeToEntity(this.camDocument, parallelAfter), false, true);
//        }
//        if (RMath.fuzzyCompare(camEntity.getStartPoint().x, 50.0)) {
//            qDebug("parallel before: ", parallelBefore);
//            qDebug("parallel after: ", parallelAfter);
//        }
        // intersection points with tab line parallels:
        var ips = [];
        var ips1 = camShape.getIntersectionPoints(parallelBefore, true);
        var ips2 = camShape.getIntersectionPoints(parallelAfter, true);
//        if (dbg) {
//            qDebug("ips1: ", ips1);
//            qDebug("ips2: ", ips2);
//        }
        if (ips1.length>0 || ips2.length>0) {
            if (ips1.length>0) {
                ips = ips.concat(ips1);
                //if (dbg) this.op.addObject(shapeToEntity(this.camDocument, new RPoint(ips1[0])), false, true);
            }
            if (ips2.length>0) {
                ips = ips.concat(ips2);
                //if (dbg) this.op.addObject(shapeToEntity(this.camDocument, new RPoint(ips2[0])), false, true);
            }
        }
//        if (isArcShape(camShape) && camShape.getRadius()>10) {
//            qDebug("tabBlockRef:", tabBlockRef);
//            qDebug("tabLine:", tabLine);
//            qDebug("ips:", ips);
//        }
        ret.push([tabBlockRef, tabLine, ips]);
    }
    return ret;
}
