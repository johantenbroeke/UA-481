function () {
    var ret = this.getZCuttingLevelOverride();
    if (!isNull(ret) && !RMath.isSane(ret)) {
        qWarning("CamExporterV2.prototype.getZCuttingLevel not sane");
    }
    return ret;
    //var docValue = parseFloat(this.getGlobalOption("ZCutting", -1.0));
    //return parseFloat(this.getLayerOption(this.getEntity(), "ZCutting", docValue));
}
