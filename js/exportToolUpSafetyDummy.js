function () {
    this.pushContext("CamRapidMoveToSafety");
    this.pushContext("CamRapidMove");
    this.exportZMove(this.cursor.z, true);
    this.popContext("CamRapidMove");
    this.popContext("CamRapidMoveToSafety");
}
