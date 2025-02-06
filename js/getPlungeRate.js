function () {
    var r = this.getToolpathOption("CamPlungeRate", undefined);
    if (isNull(r)) {
        qDebug("no plunge rate");
        return this.getFeedRate();
    }
    return r;
}
