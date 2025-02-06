function () {
    this.pushContext("CamToolDownClearance");
    this.exportZMove(this.getZClearanceLevel(), true);
    this.popContext("CamToolDownClearance");
    this.toolPosition = CamExporterV2.ToolPosition.Clearance;
}
