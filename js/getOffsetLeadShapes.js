function (leadShapes, baseShape, leadIn, hasOvercutShape) {
    var leadType = this.getLeadType(leadIn);
    if (leadType===Cam.LeadType.None) {
        return [];
    }
    var toolDiameter = this.getToolDiameter(true);
    var dir = this.getDirection();
    var side = (dir===Cam.Direction.ClimbLeft ? RS.LeftHand : RS.RightHand);
    // offset leadShapes and baseShape:
    var offsetShapes = [];
    var offsetShape;
    var offsetBaseShapeUntrimmed = undefined;
    var i, shapes, leadShape;
    for (i=0; i<leadShapes.length; i++) {
        leadShape = leadShapes[i];
        shapes = leadShape.getOffsetShapes(toolDiameter/2, 1, side);
        if (shapes.length===1) {
            offsetShapes.push(shapes[0]);
        }
    }
    shapes = baseShape.getOffsetShapes(toolDiameter/2, 1, side);
    if (shapes.length===1) {
        offsetBaseShapeUntrimmed = shapes[0];
        if (leadIn) {
            offsetShapes.push(shapes[0]);
        }
        else {
            offsetShapes.unshift(shapes[0]);
        }
    }
    // trim offset lead in / out shapes
    if (offsetShapes.length>0 && leadShapes.length>0) {
        this.trimOffsetLeadShapes(leadShapes, offsetShapes, leadType, hasOvercutShape, leadIn);
    }
    // move start / end point to account for move in which tool radius
    // compensation is switched on / off:
    if (offsetShapes.length>0 && leadShapes.length>0) {
        this.adjustOffsetLeadShapes(leadShapes, offsetShapes, offsetBaseShapeUntrimmed, leadIn);
    }
    //this.duringOffset = true;
    for (i=0; i<offsetShapes.length; i++) {
        offsetShape = offsetShapes[i];
        if (isNull(offsetShape)) {
            continue;
        }
        if (isFunction(offsetShape.data)) {
            offsetShape = offsetShape.data();
        }
        if (isArcShape(offsetShape) && offsetShape.isFullCircle()) {
            // skip full arc generated if arc radius===tool diameter:
            offsetShape = undefined;
            continue;
        }
    }
    // remove base shape if we have no overcut:
    if (!hasOvercutShape) {
        if (leadIn) {
            offsetShapes.pop();
        }
        else {
            offsetShapes.shift();
        }
    }
    return offsetShapes;
}
