function (arc) {
    if (arc.getLength()<0.01) {
        // extremely short arc: skip:
        if (arc.getLength()<0.0001) {
            return;
        }
        // very short arc: export as line segment:
        var l = new RLine(arc.getStartPoint(), arc.getEndPoint());
        this.exportLine(l);
        return;
    }
    var ignore = !this.exportRapidMoveToolDown(arc);
    var center = arc.getCenter();
    if (this.currentToolpathBlock.getCustomProperty("QCAD", "CamUseZOfGeometry", "0")!=="1") {
        center.z = this.getZCuttingLevel();
    }
    var radius = arc.getRadius();
    var camEntity = new RArcEntity(this.camDocument, new RArcData(center, radius, arc.getStartAngle(), arc.getEndAngle(), arc.isReversed()));
    this.exportCamEntity(camEntity, false, false, false, ignore);
}
