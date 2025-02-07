function (shape, leadIn) {
    // get overcut shape:
    var overcutShape = this.getOvercutShape(shape, leadIn);
    // get lead shapes:
    var leadBaseShape = (isNull(overcutShape) ? shape : overcutShape);
    var leadShapes = this.getLeadShapes(leadBaseShape, leadIn);
    var leadType = this.getLeadType(leadIn);
    // export overcut out before lead out:
    if (!leadIn && !isNull(overcutShape)) {
        this.pushContext("CamOvercutOut");
        this.exportShape(overcutShape);
        this.popContext("CamOvercutOut");
    }
    for (var i=0; i<leadShapes.length; i++) {
        var leadShape = leadShapes[i];
        if (isNull(leadShape)) {
            continue;
        }
        // tag lead in shapes:
        if (leadIn) {
            // tag first shape of lead in:
            if (i===0) {
                this.pushContext("CamCompensationOn");
            }
        }
        // tag lead out shapes:
        if (!leadIn) {
            // tag last shape of lead out:
            if (i===leadShapes.length-1) {
                this.pushContext("CamCompensationOff");
            }
        }
        //var leadType = this.getLeadType(leadIn);
        //this.pushContext(leadIn ? "CamLeadInType" : "CamLeadOutType", leadType);
        this.pushContext(leadIn ? "CamLeadIn" : "CamLeadOut");
        this.exportShape(leadShape);
        this.popContext(leadIn ? "CamLeadIn" : "CamLeadOut");
        //this.popContext(leadIn ? "CamLeadInType" : "CamLeadOutType");
        if (leadIn) {
            // tag first shape of lead in:
            if (i===0) {
                this.popContext("CamCompensationOn");
            }
        }
        // if there is no offset:
        // done after last entity of lead out:
        if (!leadIn) {
            if (i===leadShapes.length-1) {
                this.popContext("CamCompensationOff");
            }
        }
    }
    // export overcut in:
    if (leadIn && !isNull(overcutShape)) {
        this.pushContext("CamOvercutIn");
        this.exportShape(overcutShape);
        this.popContext("CamOvercutIn");
    }
    // generate offset lead shapes:
    var baseShape;
    if (isNull(overcutShape)) {
        baseShape = shape.clone();
//        if (leadIn && leadShapes.length>0) {
//            baseShape.trimStartPoint(leadShapes[leadShapes.length-1].getEndPoint());
//        }
    }
    else {
        baseShape = overcutShape;
    }
    // get offset lead in or lead in / out:
    if (leadIn) {
        this.offsetLeadInShapes = this.getOffsetLeadShapes(leadShapes, baseShape, leadIn, !isNull(overcutShape));
    }
    else {
        this.offsetLeadOutShapes = this.getOffsetLeadShapes(leadShapes, baseShape, leadIn, !isNull(overcutShape));
    }
}
