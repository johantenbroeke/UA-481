function (name, def) {
    if (isNull(this.currentToolpathBlock)) {
        qWarning("CamExporterV2.prototype.getToolpathOption: current toolpath block is NULL");
        return def;
    }
    // look up property from toolpath block:
    if (!this.currentToolpathBlock.hasCustomProperty("QCAD", name)) {
        // look up property from referenced tool instead:
        var toolName = this.currentToolpathBlock.getCustomProperty("QCAD", "CamTool", undefined);
        if (!isNull(toolName)) {
            var toolBlock = Cam.getToolBlock(this.cadDocument, toolName);
            if (!isNull(toolBlock)) {
                return toolBlock.getCustomProperty("QCAD", name, def);
            }
        }
        qWarning("toolpath references invalid tool: " + toolName);
        return def;
    }
    return this.currentToolpathBlock.getCustomProperty("QCAD", name, def);
}
