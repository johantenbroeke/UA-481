function (force) {
//    if (this.cursor.get2D().equalsFuzzy(new RVector(78.1626,20.7228), 0.1)) {
//        debugger;
//    }
    this.pushContext("CamToolUp");
    this.exportZMove(this.getZClearanceLevel(), force);
    this.popContext("CamToolUp");
    this.toolPosition = CamExporterV2.ToolPosition.Clearance;
}
