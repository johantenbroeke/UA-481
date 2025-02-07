function (includeAllowance) {
    var override = this.getToolDiameterOverride();
    if (!isNull(override)) {
        return override;
    }
    var tool = this.getCurrentToolName();
    if (isNull(tool)) {
        return 0.0;
    }
    var toolBlockName = Cam.getToolBlockName(tool);
    if (isNull(toolBlockName)) {
        return 0.0;
    }
    return Cam.getToolpathToolDiameter(this.camDocument, this.currentToolpathBlock, includeAllowance, 0.0);
}
