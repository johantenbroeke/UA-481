function (toolHeaderWritten) {
    if (this.toolChangeMode===CamExporterV2.FirstMoveMode.BeforeFirstZMove) {
        if (this.detectAndWriteToolChange(toolHeaderWritten)) {
            toolHeaderWritten = true;
        }
    }
    var unknownPosition = this.getEntityOptionBool(this.currentEntity, "CamUnknownPosition", false);
    if (unknownPosition) {
        // move to Z safety level (very first move):
        var sp = this.currentEntity.getStartPoint();
        this.xPosition = undefined;
        this.yPosition = undefined;
        this.zPosition = sp.z;
        this.xRelPosition = undefined;
        this.yRelPosition = undefined;
        this.zRelPosition = sp.z;
        this.writeRapidMoveZ();
        if (this.toolChangeMode===CamExporterV2.FirstMoveMode.BeforeFirstXYMove) {
            if (this.detectAndWriteToolChange(toolHeaderWritten)) {
                toolHeaderWritten = true;
            }
        }
        // move to X/Y (second move):
        var ep = this.currentEntity.getEndPoint();
        this.xPosition = ep.x;
        this.yPosition = ep.y;
        this.zPosition = ep.z;
        this.xRelPosition = ep.x;
        this.yRelPosition = ep.y;
        this.zRelPosition = ep.z-sp.z;
        this.writeRapidMove();
    }
    if (this.toolChangeMode===CamExporterV2.FirstMoveMode.AfterFirstXYMove ||
        this.toolChangeMode===CamExporterV2.FirstMoveMode.BeforeFirstXYMove) {
        if (this.detectAndWriteToolChange(toolHeaderWritten)) {
            toolHeaderWritten = true;
        }
    }
    return toolHeaderWritten;
}
