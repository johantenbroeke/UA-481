function (toolName) {
    // try to get safety level from tool:
    if (isNull(toolName)) {
        toolName = this.getCurrentToolName();
    }
    if (!isNull(toolName)) {
        var toolBlockName = Cam.getToolBlockName(toolName);
        if (!isNull(toolBlockName)) {
            var v = Cam.getToolParameterFloat(this.cadDocument, toolName, "CamZSafety", undefined);
            if (!isNull(v)) {
                return v;
            }
        }
    }
    if (!isNumber(this.zSafety)) {
        qWarning("this.zSafety not a number: ", this.zSafety);
    }
    // return safety level from global config:
    return this.getGlobalOptionFloat("CamZSafety", this.zSafety);
}
