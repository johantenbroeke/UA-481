function (toolCombo, toolName, toolBlock) {
    var d = toolBlock.getCustomProperty("QCAD", "CamDiameter", undefined);
    toolCombo.addItem(toolName + " [\u00F8%1]".arg(d), toolName);
    var desc = toolBlock.getCustomProperty("QCAD", "CamDescription", undefined);
    if (!isNull(desc)) {
        toolCombo.setItemData(toolCombo.count-1, desc, Qt.ToolTipRole);
    }
}
