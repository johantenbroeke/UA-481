function (shape) {
    var ignore = this.getIgnoreOffsetContext();
    //var startPoint = shape.getStartPoint();
    // rapid move to offset:
    // but program real contour:
//    if (this.rapidMoveToOffset && !this.outputOffsetPath) {
////        if (this.checkContext("CamNotOffset")) {
//////            this.exportToolDown();
////            return true;
////        }
//        if (this.checkContext("CamOffset")) {
//            qDebug("==== exportRapidMoveToolDown ====");
//            qDebug(shape);
//            this.dumpContext();
//            if (startPoint.equalsFuzzy(new RVector(35, 35))) {
//                this.exportRapidMoveTo(startPoint);
//                this.exportToolDown();
//                return true;
//            }
////            this.rapidMoveToOffset = false;
//            return false;
//        }
//    }
    // move to start if entity is not ignored:
    if (!ignore) {
        var startPoint = shape.getStartPoint();
        //if (!this.checkContext("CamTab")) {
        if (this.toolPosition !== CamExporterV2.ToolPosition.Tab) {
            this.exportRapidMoveTo(startPoint);
            if (this.currentToolpathBlock.getCustomProperty("QCAD", "CamUseZOfGeometry", "0")==="1") {
                // use Z of shape:
                this.exportToolDown(startPoint.z);
            }
            else {
                this.exportToolDown();
            }
        }
    }
    return !ignore;
}
