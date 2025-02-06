function (doc, toolTypeFilter) {
    if (isNull(doc)) {
        doc = this.cadDocument();
    }
    var configName = this.getConfigName();
    var toolBlockNames = this.getToolBlockNames(doc, toolTypeFilter);
    var toolNames = [];
    for (var i=0; i<toolBlockNames.length; i++) {
        var toolBlockName = toolBlockNames[i];
        var toolName = this.getToolName(toolBlockName);
        toolNames.push(toolName);
    }
    return toolNames;
}
