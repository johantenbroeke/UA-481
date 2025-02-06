function (dialog, obj, msgs) {
    var cbLeadInType = dialog.findChild("CamLeadInType");
    var cbLeadOutType = dialog.findChild("CamLeadOutType");
    var leLeadInSize = dialog.findChild("CamLeadInSize");
    var leLeadOutSize = dialog.findChild("CamLeadInSize");
    var cbTool = dialog.findChild("CamTool");
    var leDiameter = dialog.findChild("CamDiameter");
    var leToolName = dialog.findChild("ToolName");
    var leadInType = undefined;
    if (!isNull(cbLeadInType)) {
        leadInType = cbLeadInType.itemData(cbLeadInType.currentIndex);
    }
    var leadOutType = undefined;
    if (!isNull(cbLeadOutType)) {
        leadOutType = cbLeadOutType.itemData(cbLeadOutType.currentIndex);
    }
    var leadInSize = undefined;
    if (!isNull(leLeadInSize)) {
        leadInSize = leLeadInSize.getValue();
    }
    var leadOutSize = undefined;
    if (!isNull(leLeadOutSize)) {
        leadOutSize = leLeadOutSize.getValue();
    }
    var toolName = undefined;
    if (!isNull(cbTool)) {
        // tool name from combo:
        toolName = cbTool.itemData(cbTool.currentIndex);
    }
    else if (!isNull(leToolName)) {
        // tool name from line edit:
        toolName = leToolName.text;
    }
    // get tool diameter from tool block:
    var toolDiameter = undefined;
    if (!isNull(toolName)) {
        toolDiameter = Cam.getToolDiameter(this.cadDocument, toolName, undefined);
    }
    // get tool diameter from input:
    if (!isNull(leDiameter)) {
        toolDiameter = leDiameter.getValue();
    }
    var valid = true;
    if (Cam.isCircleLeadType(leadInType)) {
        if (!isNull(leLeadInSize)) {
            valid = valid && this.validateLeadRadius(msgs, leadInSize, toolDiameter, true);
        }
    }
    if (Cam.isCircleLeadType(leadOutType)) {
        if (!isNull(leLeadOutSize)) {
            valid = valid && this.validateLeadRadius(msgs, leadOutSize, toolDiameter, false);
        }
    }
    return valid;
}
