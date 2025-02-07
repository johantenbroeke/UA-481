function (spline) {
    var ignore = !this.exportRapidMoveToolDown(spline);
    var startPoint = spline.getStartPoint();
    var endPoint = spline.getEndPoint();
    if (this.currentToolpathBlock.getCustomProperty("QCAD", "CamUseZOfGeometry", "0")!=="1") {
        startPoint.z = this.getZCuttingLevel();
        endPoint.z = this.getZCuttingLevel();
    }
    var camEntity = new RSplineEntity(this.camDocument, new RSplineData(spline));
    this.exportCamEntity(camEntity, false, false, false, ignore);
}
