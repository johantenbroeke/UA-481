function (p) {
    if (p.equalsFuzzy2D(this.cursor, this.tolerance)) {
        return;
    }
    if (this.toolPosition !== CamExporterV2.ToolPosition.Clearance &&
        this.toolPosition !== CamExporterV2.ToolPosition.Safety &&
        this.toolPosition !== CamExporterV2.ToolPosition.Unknown) {
        this.exportToolUp();
    }
    //this.duringRapidMove = true;
    var dest = p.copy();
    dest.z = this.cursor.z;
    // rapid move to pos:
    this.pushContext("CamRapidMove");
    var camEntity = new RLineEntity(this.camDocument, new RLineData(this.cursor, dest));
    this.exportCamEntity(camEntity, false, true, true, false);
    this.popContext("CamRapidMove");
}
