function (zOverride) {
//    if (this.cursor.get2D().equalsFuzzy(new RVector(10,20), 0.1)) {
//        debugger;
//    }
    // move tool to clearance level:
    // if tool is on clearance level, add zero length entity:
    if (this.toolPosition === CamExporterV2.ToolPosition.Safety ||
        this.toolPosition === CamExporterV2.ToolPosition.Clearance) {
        // this is a rapid move down to the clearance level:
        this.pushContext("CamRapidMove");
        // rapid move to clearance:
        this.exportToolDownClearance();
        // rapid move to clearance of current pass (e.g. -2.5 + 2):
        this.exportToolDownClearancePass();
        this.popContext("CamRapidMove");
    }
    var z = this.getZCuttingLevel();
    if (!isNull(zOverride)) {
        z = zOverride;
    }
    if (isNull(z)) {
        debugger;
        this.warnUser(qsTranslate('CamExporterV2', "No tool down level defined."));
        return false;
    }
    this.pushContext("CamToolDown");
    var ret = this.exportZMove(z);
    this.popContext("CamToolDown");
    this.toolPosition = CamExporterV2.ToolPosition.Down;
    if (isNull(this.xFirstPosition)) {
        this.xFirstPosition = this.cursor.x;
    }
    if (isNull(this.yFirstPosition)) {
        this.yFirstPosition = this.cursor.y;
    }
    return ret;
}
