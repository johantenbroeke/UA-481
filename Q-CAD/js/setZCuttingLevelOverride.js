function (z) {
    qDebug("CamExporterV2.prototype.setZCuttingLevelOverride: ", z);
    if (!isNull(z) && !RMath.isSane(z)) {
        debugger;
    }
    this.zCuttingLevelOverride = z;
}
