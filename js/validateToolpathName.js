function (dialog, obj, msgs, initial) {
    var leToolpathName = dialog.findChild("ToolpathName");
    var valid = true;
    var toolpathName = leToolpathName.text;
    if (toolpathName.indexOf("$$")!==-1) {
        if (!isNull(msgs)) {
            msgs.push(qsTranslate('CamExporterV2', "Toolpath name may not contain $$."));
        }
        valid = false;
    }
    if (toolpathName!==toolpathName.trim()) {
        if (!isNull(msgs)) {
            msgs.push(qsTranslate('CamExporterV2', "Leading or trailing spaces in toolpath name."));
        }
        valid = false;
    }
    if (toolpathName.isEmpty()) {
        if (!isNull(msgs)) {
            msgs.push(qsTranslate('CamExporterV2', "Toolpath name is empty."));
        }
        valid = false;
    }
    var blockName = Cam.getToolpathBlockName(leToolpathName.text);
    if (this.cadDocument.hasBlock(blockName)) {
        if (isNull(obj) ||
            obj.getName().toLowerCase() !== blockName.toLowerCase()) {
            if (!isNull(msgs)) {
                msgs.push(qsTranslate('CamExporterV2', "Toolpath with this name already exists."));
            }
            valid = false;
        }
    }
    return valid;
}
