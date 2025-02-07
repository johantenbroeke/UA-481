function (doc, toolTypeFilter) {
    if (isNull(doc)) {
        doc = this.cadDocument();
    }
    var configName = this.getConfigName();
    var rxStr = "^" + Cam.toolNamePrefix + Cam.blockNameSeparatorRx + configName + Cam.blockNameSeparatorRx + ".*";
    var toolBlockNames = doc.getBlockNames(rxStr);
    if (isNull(toolTypeFilter) || toolTypeFilter===Cam.ToolTypeFilter.All) {
        return toolBlockNames;
    }
    // filter by tool type:
    var ret = [];
    for (var i=0; i<toolBlockNames.length; i++) {
        var toolBlockName = toolBlockNames[i];
        var toolName =this.getToolName(toolBlockName);
        //var toolBlock = doc.queryBlockDirect(toolBlockName);
        var t = Cam.getToolType(doc, toolName, undefined);
        if (this.matchToolType(t, toolTypeFilter)) {
            ret.push(toolBlockName);
        }
    }
    return ret;
}
