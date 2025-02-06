function (entity) {
    var entityTransformed = entity.clone();
    this.transform(entityTransformed);
    // current entity:
    this.currentEntity = entityTransformed;
    // previous entity:
    var prevSubId = undefined;
    if (this.writeEntityIndex-1>=0) {
        prevSubId = this.writeEntityIds[this.writeEntityIndex-1];
    }
    this.entityPrev = undefined;
    if (!isNull(prevSubId)) {
        this.entityPrev = this.camDocument.queryEntityDirect(prevSubId);
    }
    // next entity:
    var nextSubId = undefined;
    if (this.writeEntityIndex+1<this.writeEntityIds.length) {
        nextSubId = this.writeEntityIds[this.writeEntityIndex+1];
    }
    this.entityNext = undefined;
    if (!isNull(nextSubId)) {
        this.entityNext = this.camDocument.queryEntityDirect(nextSubId);
    }
    this.firstEntityOfProfile = false;
    this.lastEntityOfProfile = false;
    if (this.getEntityOptionBool(this.currentEntity, "CamOvercutIn", false)===false &&
        this.getEntityOptionBool(this.currentEntity, "CamLeadIn", false)===false &&
        this.getEntityOptionBool(this.currentEntity, "CamOvercutOut", false)===false &&
        this.getEntityOptionBool(this.currentEntity, "CamLeadOut", false)===false) {
        if (isNull(this.entityPrev)) {
            // first entity and
            // not a lead in:
            this.firstEntityOfProfile = true;
        }
        else {
            if (this.getEntityOptionBool(this.entityPrev, "CamLeadIn", false)===true ||
                this.getEntityOptionBool(this.entityPrev, "CamOvercutIn", false)===true) {
                // previous is lead in or overcut in and
                // current is not overcut in:
                this.firstEntityOfProfile = true;
            }
        }
        if (isNull(this.entityNext)) {
            // last entity and
            // not a lead out:
            this.lastEntityOfProfile = true;
        }
        else {
            if (this.getEntityOptionBool(this.entityNext, "CamLeadOut", false)===true ||
                this.getEntityOptionBool(this.entityNext, "CamOvercutOut", false)===true) {
                // next is lead out or overcut out and
                // current is not overcut out:
                this.lastEntityOfProfile = true;
            }
        }
    }
    // set variables from entity:
    var sp = this.currentEntity.getStartPoint();
    var ep = this.currentEntity.getEndPoint();
    this.xStartPosition = sp.x;
    this.yStartPosition = sp.y;
    this.zStartPosition = sp.z;
    this.startAngle = 0.0;
    if (isFunction(this.currentEntity.getDirection1)) {
        // for lines, arcs, init start angle (e.g. for rotary knives):
        this.startAngle = this.currentEntity.getDirection1();
    }
    this.endAngle = 0.0;
    if (isFunction(this.currentEntity.getDirection2)) {
        // for lines, arcs, init start angle (e.g. for rotary knives):
        this.endAngle = RMath.getNormalizedAngle(this.currentEntity.getDirection2() + Math.PI);
    }
    if (this.getEntityOptionBool(this.currentEntity, "CamUnknownPosition", false)===true) {
        // unknown position (first entity)
        this.xPosition = ep.x;
        this.yPosition = ep.y;
        this.xRelPosition = ep.x;
        this.yRelPosition = ep.y;
    }
    else {
        this.xPosition = ep.x;
        this.yPosition = ep.y;
        this.xRelPosition = ep.x - sp.x;
        this.yRelPosition = ep.y - sp.y;
    }
    this.zPosition = ep.z;
    this.zRelPosition = ep.z - sp.z;
    // feedRate and plungeRate are both stored as CamFeedRate in entity:
    var tpPlungeRate = this.getToolpathOptionFloat("CamPlungeRate", 0.0);
    var tpFeedRate = this.getToolpathOptionFloat("CamFeedRate", 0.0);
    this.feedRate = this.getEntityOptionFloat(this.currentEntity, "CamFeedRate", tpFeedRate);
    this.plungeRate = this.getEntityOptionFloat(this.currentEntity, "CamFeedRate", tpPlungeRate);
    this.cuttingContour = this.getEntityOptionBool(this.currentEntity, "CamCuttingContour", false);
    this.cuttingContourNext = this.getEntityOptionBool(this.entityNext, "CamCuttingContour", false);
    this.cuttingContourPrev = this.getEntityOptionBool(this.entityPrev, "CamCuttingContour", false);
    this.contourIndex = this.getEntityOptionInt(this.currentEntity, "CamContourIndex", -1);
    this.contourIndexPrev = this.getEntityOptionInt(this.entityPrev, "CamContourIndex", -1);
    this.contourIndexNext = this.getEntityOptionInt(this.entityNext, "CamContourIndex", -1);
    this.firstContour = this.getEntityOptionBool(this.currentEntity, "CamFirstContour", false);
    this.lastContour = this.getEntityOptionBool(this.currentEntity, "CamLastContour", false);
    this.passes = this.getEntityOptionInt(this.currentEntity, "CamZPasses", -1);
    this.pass = this.getEntityOptionInt(this.currentEntity, "CamZPass", -1);
    this.passPrev = -1;
    if (!isNull(this.entityPrev)) {
        this.passPrev = this.entityPrev.getCustomIntProperty("QCAD", "CamZPass", -1);
    }
    this.passNext = -1;
    if (!isNull(this.entityNext)) {
        this.passNext = this.entityNext.getCustomIntProperty("QCAD", "CamZPass", -1);
    }
    this.zClearancePass = this.getEntityOptionFloat(this.currentEntity, "CamZClearancePass", undefined);
    // set variables for start / end Z levels of this toolpath:
    if (Cam.useSameTool(this.currentToolpathBlock, this.toolpathBlockPrev) ||
        (!isNull(this.pass) && this.pass>1)) {
        this.zStart = this.zClearance;
    }
    else {
        this.zStart = this.zSafety;
    }
    if (Cam.useSameTool(this.currentToolpathBlock, this.toolpathBlockNext) ||
        (!isNull(this.pass) && this.pass<this.passes)) {
        this.zEnd = this.zClearance;
    }
    else {
        this.zEnd = this.zSafety;
    }
    this.zCuttingDepth = -this.getToolpathZCuttingDepth();
}
