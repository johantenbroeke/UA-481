function (contour) {
    if (this.toolPosition !== CamExporterV2.ToolPosition.Safety &&
        this.toolPosition !== CamExporterV2.ToolPosition.Clearance) {
        this.exportToolUp();
    }
}
