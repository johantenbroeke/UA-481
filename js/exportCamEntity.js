function (camEntity, noProperties, noOffset, noTabs, ignore) {
    if (isNull(noProperties)) {
        noProperties = false;
    }
    if (isNull(noOffset)) {
        noOffset = false;
    }
    if (isNull(ignore)) {
        ignore = false;
    }
    if (!camEntity.getStartPoint().isSane()) {
        debugger;
    }
    if (!camEntity.getEndPoint().isSane()) {
        debugger;
    }
    // check for tabs and split up entity if tabs are present on it:
    if (!noTabs) {
        // skip not offset entities for exporters which export offset path:
        if (this.outputOffsetPath===false || !this.checkContext("CamNotOffset")) {
            if (!this.checkContext("CamRapidMove") && !this.checkContext("CamZMove") && !this.unknownPosition) {
                if (this.exportSplitCamEntity(camEntity, noProperties, noOffset, ignore)) {
                    return;
                }
            }
        }
    }
    var i;
    if (!ignore && this.unknownPosition===true) {
        camEntity.setCustomProperty("QCAD", "CamUnknownPosition", "1");
        this.unknownPosition = false;
    }
//    if (this.isFirstMove===true) {
//        camEntity.setCustomProperty("QCAD", "CamFirstMove", "1");
//        this.isFirstMove = false;
//    }
    // compile list of variables to ignore:
    // for example if context contains "CamRapidMove", several contexts
    // for leads and compensation are ignored:
    var ignoredContext = this.getIgnoredContexts();
    //qDebug("ignoring contexts:", ignoredContext);
    for (i=0; i<this.context.length; i++) {
        if (isArray(this.context[i])) {
            if (ignoredContext.indexOf(this.context[i][0])===-1) {
                camEntity.setCustomProperty("QCAD", this.context[i][0], this.context[i][1]);
            }
        }
        else {
            if (ignoredContext.indexOf(this.context[i])===-1) {
                camEntity.setCustomProperty("QCAD", this.context[i], "1");
            }
        }
    }
    // no tool for (first) move to safety level:
    if (!this.checkContext("CamRapidMoveToSafety")) {
        camEntity.setCustomProperty("QCAD", "CamTool", this.getCurrentToolName());
    }
    //if (!isNull(this.currentToolpathBlock)) {
        //camEntity.setCustomProperty("QCAD", "CamToolpathName", Cam.getToolpathName(this.currentToolpathBlock.getName()));
        //camEntity.setCustomProperty("QCAD", "CamSubToolpathName", Cam.getSubToolpathName(this.currentToolpathBlock.getName()));
    //}
    //camEntity.setCustomProperty("QCAD", "CamSpindleSpeed", this.getSpindleSpeed());
    if (!this.checkContext("CamRapidMove")) {
        // we're exporting offset entities:
//        if (this.duringOffset===true) {
//            camEntity.setCustomProperty("QCAD", "CamOffset", "1");
//        }
        // we're exporting not-offset entities but offset entities are also available:
//        if (this.duringOffset===false) {
//            camEntity.setCustomProperty("QCAD", "CamOffset", "0");
        camEntity.setCustomProperty("QCAD", "CamDirection", this.getDirection());
//        }
        if (camEntity.getStartPoint().z<=camEntity.getEndPoint().z+0.001) {
            // feed rate for horizontal moves or upward moves:
            camEntity.setCustomProperty("QCAD", "CamFeedRate", this.getFeedRate());
        }
        else {
            // feed rate for downward z move:
            camEntity.setCustomProperty("QCAD", "CamFeedRate", this.getPlungeRate());
        }
    }
    var camEntityOri = camEntity.clone();
    camEntity.setLayerId(this.getCamLayerId());
    // no transformation, instead scale values while writing
    //this.transform(camEntity);
    if (!isNull(this.currentToolpathBlock)) {
        camEntity.setBlockId(this.currentToolpathBlock.getId());
    }
    // make sure all exported entities are connected:
    if (!ignore) {
        if (!isNull(this.cursor) && !camEntity.getStartPoint().equalsFuzzy(this.cursor, this.tolerance)) {
            qDebug("toolpath gap detected!");
            qDebug("  cursor: ", this.cursor);
            qDebug("  entity start: ", camEntity.getStartPoint());
            //debugger;
        }
        this.cursor = camEntity.getEndPoint();
    }
    else {
        camEntity.setCustomProperty("QCAD", "CamIgnore", "1");
    }
    // split arcs at quadrant lines:
    if (this.splitArcsAtQuadrantLines && isArcEntity(camEntity)) {
        var segments = camEntity.castToShape().splitAtQuadrantLines()
        for (i=0; i<segments.length; i++) {
            var camEntityClone = camEntity.clone();
            camEntityClone.setShape(segments[i]);
            if (i!==0) {
                camEntityClone.removeCustomProperty("QCAD", "CamFirstSegment");
            }
            if (i!==segments.length-1) {
                camEntityClone.removeCustomProperty("QCAD", "CamLastSegment");
            }
            // make sure entities don't use drawing order of originals but order of exporting:
            camEntityClone.setDrawOrder(this.drawOrder++);
            this.op.addObject(camEntityClone, false, true);
        }
    }
    else {
        // make sure entities don't use drawing order of originals but order of exporting:
        camEntity.setDrawOrder(this.drawOrder++);
        this.op.addObject(camEntity, false, true);
    }
    //qDebug("exported: ", camEntity.castToShape());
    //qDebug("   offset: ", camEntity.getCustomProperty("QCAD", "CamOffset", undefined));
//    if (this.duringRapidMove) {
//        this.setCursor(camEntity.getEndPoint());
//    }
//    else {
//        // exporting offset entity and we export offset paths:
//        if (this.duringOffset===true && this.outputOffsetPath) {
//            this.setCursor(camEntity.getEndPoint());
//        }
//        // exporting original entity and we export original paths:
//        if (this.duringOffset===false && !this.outputOffsetPath) {
//            this.setCursor(camEntity.getEndPoint());
//        }
////        if (isNull(this.duringOffset)) {
////            this.setCursor(camEntity.getEndPoint());
////        }
//    }
    if (!this.checkContext("CamRapidMove") && !noOffset) {
        if (this.getSide()!==Cam.Side.None) {
            this.collectCamOffsetPath(camEntityOri);
        }
    }
}
