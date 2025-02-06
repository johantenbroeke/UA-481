function (toolpathBlock) {
    if (isNull(toolpathBlock)) {
        qWarning("no toolpath block");
        return;
    }
    if (isNull(this.toolCallList)) {
        this.toolCallList = {};
    }
    this.currentToolpathBlock = toolpathBlock;
    this.toolpathName = Cam.getToolpathName(toolpathBlock.getName());
    this.toolpathOrder = Cam.getToolpathOrder(toolpathBlock);
    this.toolpathBlockPrev = Cam.getPrevToolpathBlock(toolpathBlock);
    this.toolpathBlockNext = Cam.getNextToolpathBlock(toolpathBlock);
    this.toolpathIndex = this.getToolpathOptionInt("CamToolpathIndex", -1);
    this.contourCount = this.getToolpathOptionInt("CamContourCount", -1);
    // find out current, previous and next tool:
    this.tool = Cam.getToolpathToolName(toolpathBlock);
    if (isNull(this.toolCallList[this.tool])) {
        this.toolCallList[this.tool] = 1;
    }
    else {
        this.toolCallList[this.tool]++;
    }
    this.toolCalls = this.toolCallList[this.tool];
    this.toolDiameter = Cam.getToolpathToolDiameter(this.cadDocument, toolpathBlock, false);
    this.toolRadius = this.toolDiameter/2;
    this.toolBlock = Cam.getToolBlock(this.cadDocument, this.tool);
    this.toolPrev = undefined;
    if (!isNull(this.toolpathBlockPrev)) {
        this.toolPrev = Cam.getToolpathToolName(this.toolpathBlockPrev);
    }
    this.toolNext = undefined;
    if (!isNull(this.toolpathBlockNext)) {
        this.toolNext = Cam.getToolpathToolName(this.toolpathBlockNext);
    }
    this.toolType = Cam.getToolType(this.cadDocument, this.tool, undefined);
    this.toolpathType = this.getCurrentToolpathType();
    this.zSafety = this.getToolpathOptionFloat("CamZSafety", undefined);
    this.zClearance = this.getToolpathOptionFloat("CamZClearance", undefined);
    this.direction = this.getToolpathOptionInt("CamDirection", -1);
    this.leadInType = this.getToolpathOptionInt("CamLeadInType", -1);
    // tool options that might not be stored / duplicated in toolpath:
    this.spindleSpeed = undefined;
    if (!isNull(this.toolBlock)) {
        this.spindleSpeed = this.toolBlock.getCustomDoubleProperty("QCAD", "CamSpindleSpeed", -1.0);
        if (this.spindleSpeed<0.0) {
            this.spindleSpeed = undefined;
        }
    }
    // get spindle speed from toolpath (if available), default to spindle speed from tool:
    this.spindleSpeed = this.getToolpathOptionFloat("CamSpindleSpeed", this.spindleSpeed);
    if (this.spindleSpeed<RS.PointTolerance) {
        this.spindleSpeed = undefined;
    }
    // feed rate and plunge rate as stored in toolpath:
    // overwritten as soon as we are exporting entities:
    this.plungeRate = this.getToolpathOptionFloat("CamPlungeRate", 0.0);
    //qDebug("plungeRate:", this.plungeRate);
    this.feedRate = this.getToolpathOptionFloat("CamFeedRate", 0.0);
}
