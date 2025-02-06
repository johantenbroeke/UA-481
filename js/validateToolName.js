function (dialog, obj, msgs) {
    var leToolName = dialog.findChild("ToolName");
    var toolBlockName = Cam.getToolBlockName(leToolName.text);
    if (this.cadDocument.hasBlock(toolBlockName)) {
        if (isNull(obj) ||
            obj.getName().toLowerCase() !== toolBlockName.toLowerCase()) {
            if (!isNull(msgs)) {
                msgs.push(qsTranslate('CamExporterV2', "Tool already exists."));
            }
            return false;
        }
    }
    return true;
}
