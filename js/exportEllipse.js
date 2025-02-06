function (ellipse) {
    var ignore = !this.exportRapidMoveToolDown(ellipse);
    var startPoint = ellipse.getStartPoint();
    var endPoint = ellipse.getEndPoint();
    if (this.currentToolpathBlock.getCustomProperty("QCAD", "CamUseZOfGeometry", "0")!=="1") {
        startPoint.z = this.getZCuttingLevel();
        endPoint.z = this.getZCuttingLevel();
    }
    var camEntity = new REllipseEntity(this.camDocument, new REllipseData(ellipse));
    this.exportCamEntity(camEntity, false, false, false, ignore);
}
