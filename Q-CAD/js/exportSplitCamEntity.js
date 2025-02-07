function (camEntity, noProperties, noOffset, ignore) {
//    if (isNull(this.zTabLevel)) {
//        this.zTabLevel = this.getZCuttingLevel();
//    }
    var i;
    var tabLine;
    var tabLength;
    var tabThickness;
    var zFinalLevel = -this.getToolpathZCuttingDepth();
    // get array of all tab block refs and tab lines
    // (lines orthogonal to shape at tab position):
    // [ tabBlockRef, tabLine, [intersection point, intersection point] ]
    var tabInfo = this.getTabInfo(camEntity);
    if (tabInfo.length===0) {
        // no tabs exist in drawing
        // no splits necessary:
        return false;
    }
    // collect all intersection points:
    // collect all tab info of tabs with split points:
    var ipsAll = [];
    for (i=0; i<tabInfo.length; i++) {
        if (tabInfo[i][2].length>0) {
            ipsAll = ipsAll.concat(tabInfo[i][2]);
        }
    }
    // split shape at intersection points:
    var camShape2D = camEntity.castToShape().clone();
    camShape2D.to2D();
    var segmentShapes2D = camShape2D.splitAt(ipsAll);
    if (segmentShapes2D.length===0) {
        // no segments after splitting (should not happen):
        this.zTabLevel = camEntity.getStartPoint().z;
        return false;
    }
    // add segment by segment to output toolpath:
    var first = true;
    for (i=0; i<segmentShapes2D.length; i++) {
        var segmentShape2D = segmentShapes2D[i];
        //qDebug("segment: ", segmentShape2D);
        //qDebug("segment middle: ", segmentShape2D.getMiddlePoint());
        var segmentEntity = camEntity.clone();
        segmentEntity.setShape(segmentShape2D.data());
        // check if segment is close to intersecting tab line:
        var isOnTab = false;
        for (var k=0; k<tabInfo.length; k++) {
            var tabBlockRef = tabInfo[k][0];
            tabLine = tabInfo[k][1];
            tabLength = tabBlockRef.getCustomDoubleProperty("QCAD", "CamTabLength", 0.0);
            //qDebug("tabLine:", tabLine);
            if (tabLine.getDistanceTo(segmentShape2D.getMiddlePoint()) < tabLength+0.01) {
                //this.op.addObject(shapeToEntity(this.camDocument, tabLine), false, true);
                tabThickness = tabBlockRef.getCustomDoubleProperty("QCAD", "CamTabThickness", 0.0);
                isOnTab = true;
                break;
            }
        }
        var prevZTabLevel = this.zTabLevel;
        var useZTabLevel = false;
        // segment may be elevated to tab level:
        if (isOnTab) {
            // final cutting depth:
            var zTabLevel = zFinalLevel + tabThickness;
            if (zTabLevel>camEntity.getStartPoint().z || this.allowNegativeTabs) {
                // segment is elevated to tab level:
                useZTabLevel = true;
                this.zTabLevel = zTabLevel;
            }
            else {
                // segment is above tab level:
                useZTabLevel = false;
                this.zTabLevel = camEntity.getStartPoint().z;
            }
        }
        // segment not on tab / not elevated:
        else {
            this.zTabLevel = camEntity.getStartPoint().z;
        }
//        if (isArcEntity(camEntity) && camEntity.getRadius()>10) {
//            qDebug("prevZTabLevel:", prevZTabLevel);
//            qDebug("this.zTabLevel:", this.zTabLevel);
//        }
        // set segment Z level to tab level or normal level:
        segmentEntity.setZ(this.zTabLevel);
        // insert line to move up to / down from tab level:
        if (!this.stopAtTab && !isNull(prevZTabLevel) && !RMath.fuzzyCompare(this.zTabLevel, prevZTabLevel) &&
            segmentShapes2D.length>1) {
            //if (isArcEntity(camEntity) && camEntity.getRadius()>10) {
//                qDebug("insert Z move");
//                qDebug("prevZTabLevel:", prevZTabLevel);
//                qDebug("this.zTabLevel:", this.zTabLevel);
            //}
            var ep = segmentEntity.getStartPoint();
            var sp = new RVector(ep.x, ep.y, prevZTabLevel);
//            if (isArcEntity(camEntity) && camEntity.getRadius()>10) {
//                qDebug("sp:", sp);
//                qDebug("ep:", ep);
//            }
            var e = new RLineEntity(this.camDocument, new RLineData(sp, ep));
            e.copyAttributesFrom(camEntity);
            e.copyCustomPropertiesFrom(camEntity);
            //var up = RMath.fuzzyCompare(this.zTabLevel, zTabLevel);
            if (useZTabLevel) {
                this.toolPosition = CamExporterV2.ToolPosition.Tab;
            }
            this.pushContext("CamTab");
            // move to tab height or back to cutting height:
            this.pushContext("CamZMove");
            this.pushContext(useZTabLevel ? "CamTabUp" : "CamTabDown");
            this.exportCamEntity(e, noProperties, noOffset, true, ignore);
            this.popContext(useZTabLevel ? "CamTabUp" : "CamTabDown");
            this.popContext("CamZMove");
            this.popContext("CamTab");
            if (!useZTabLevel) {
                this.toolPosition = CamExporterV2.ToolPosition.Down;
            }
        }
        //qDebug("exporting segment:", segmentShape);
        //var zCuttingLevelOverride = this.zCuttingLevelOverride;
        if (useZTabLevel) {
            //this.tabZCuttingLevelOverride = this.zCuttingLevelOverride;
            //this.zCuttingLevelOverride = this.zTabLevel;
            this.pushContext("CamTab");
            this.pushContext("CamTabTop");
        }
        else {
            //if (!isNull(this.tabZCuttingLevelOverride)) {
                //this.zCuttingLevelOverride = this.tabZCuttingLevelOverride;
                //this.tabZCuttingLevelOverride = undefined;
            //}
        }
        if (this.stopAtTab && useZTabLevel) {
            this.pushContext("CamRapidMove");
        }
        // move at top level of tab:
        this.exportCamEntity(segmentEntity, noProperties, noOffset, true, ignore);
        if (this.stopAtTab && useZTabLevel) {
            this.popContext("CamRapidMove");
        }
        if (useZTabLevel) {
            this.popContext("CamTabTop");
            this.popContext("CamTab");
        }
        if (first) {
            // first segment written:
            // all following segments are no longer the first segment:
            this.ignoredContexts = [ "CamFirstSegment" ];
            first = false;
        }
    }
    this.ignoredContexts = [];
    return true;
}
