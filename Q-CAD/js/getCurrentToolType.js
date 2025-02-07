function () {
    var toolName = this.currentToolpathBlock.getCustomProperty("QCAD", "CamTool", undefined);
    if (isNull(toolName)) {
        return Cam.ToolType.Mill;
    }
    return Cam.getToolType(this.cadDocument, toolName, Cam.ToolType.Mill);
}
