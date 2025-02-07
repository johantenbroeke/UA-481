function (toolCombo, addNoneItem, toolTypeFilter) {
    if (isNull(addNoneItem)) {
        addNoneItem = true;
    }
    if (isNull(toolTypeFilter)) {
        toolTypeFilter = Cam.ToolTypeFilter.All;
    }
    toolCombo.blockSignals(true);
    toolCombo.clear();
    // set properties to auto update combo when tool added:
    toolCombo.setProperty("CamToolType", toolTypeFilter);
    toolCombo.setProperty("CamToolAddNone", addNoneItem);
    // empty item to clear at the top:
    if (addNoneItem===true) {
        toolCombo.addItem("- " + qsTranslate('CamExporterV2', "None") + " -", -1);
        toolCombo.insertSeparator(toolCombo.count);
    }
    // add tools:
    var toolNames = this.getToolNames(this.cadDocument, toolTypeFilter);
    toolNames.sort(Array.alphaNumericalSorter);
    //toolNames = RS.sortAlphanumerical(toolNames);
    if (!isNull(toolNames)) {
        for (var i=0; i<toolNames.length; i++) {
            var toolName = toolNames[i];
            var toolBlockName = Cam.getToolBlockName(toolName);
            var toolBlock = this.cadDocument.queryBlock(toolBlockName);
            if (isNull(toolBlock)) {
                continue;
            }
            //var d = toolBlock.getCustomProperty("QCAD", "CamDiameter", undefined);
            //toolCombo.addItem(toolName + " [\u00F8%1]".arg(d), toolName);
            this.initToolComboItem(toolCombo, toolName, toolBlock);
        }
    }
    toolCombo.blockSignals(false);
}
