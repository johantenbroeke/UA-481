function (toolName) {
//    if (this.cursor.get2D().equalsFuzzy(new RVector(10,40), 0.1)) {
//        debugger;
//    }
    this.pushContext("CamRapidMoveToSafety");
    this.pushContext("CamRapidMove");
    // if position is unknown, always move to safety level:
    this.exportZMove(this.getSafetyLevel(toolName), this.unknownPosition===true);
    this.popContext("CamRapidMove");
    this.popContext("CamRapidMoveToSafety");
    this.toolPosition = CamExporterV2.ToolPosition.Safety;
}
