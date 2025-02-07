function (line) {
    var ignore = !this.exportRapidMoveToolDown(line);
    // TODO: check if this is needed:
    var startPoint = line.getStartPoint();
    var endPoint = line.getEndPoint();
    if (this.currentToolpathBlock.getCustomProperty("QCAD", "CamUseZOfGeometry", "0")!=="1") {
        startPoint.z = this.getZCuttingLevel();
        endPoint.z = this.getZCuttingLevel();
    }
    var camEntity = new RLineEntity(this.camDocument, new RLineData(startPoint, endPoint));
    //camEntity.copyCustomPropertiesFrom(entity);
    this.exportCamEntity(camEntity, false, false, false, ignore);
}
