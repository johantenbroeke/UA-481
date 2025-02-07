function () {
    this.pushContext("CamToolDownClearancePass");
    this.exportZMove(this.getZClearancePass(), true);
    this.popContext("CamToolDownClearancePass");
    this.toolPosition = CamExporterV2.ToolPosition.ClearancePass;
}
