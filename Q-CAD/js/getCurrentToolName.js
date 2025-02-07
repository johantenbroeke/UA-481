function () {
    if (!isNull(this.toolOverride)) {
        // tool temporarily overridden
        // (used for retreat to safety level for tool change):
        return this.toolOverride;
    }
    return this.getToolpathOption("CamTool", undefined);
}
