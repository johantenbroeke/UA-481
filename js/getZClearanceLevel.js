function () {
    var override = this.getZClearanceLevelOverride();
    if (!isNull(override)) {
        return override;
    }
    var ret = parseFloat(this.getGlobalOption("CamZClearance", 2.0));
    if (!RMath.isSane(ret)) {
        ret = 2.0;
    }
    return ret;
}
