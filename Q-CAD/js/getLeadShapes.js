function (shape, leadIn) {
    if (isNull(leadIn)) {
        leadIn = true;
    }
    var leadType, leadSize, leadDir, leadAngle, leadFromCenter;
    leadType = this.getLeadType(leadIn);
    leadSize = this.getLeadSize(leadIn);
    leadDir = this.getDirection();
    // no lead shape possible:
    if (isNull(leadType) || isNull(leadSize) || isNull(leadDir)) {
        return [];
    }
    // lead switched off:
    if (leadType===Cam.LeadType.None) {
        return [];
    }
    // angular lead shape but no angle given:
    if (leadType===Cam.LeadType.Angular && isNull(leadAngle)) {
        return [];
    }
    // invalid side:
    if (leadDir!==Cam.Direction.ClimbLeft && leadDir!==Cam.Direction.ConventionalRight) {
        return [];
    }
    // angle of circular lead:
    switch (leadType) {
    case Cam.LeadType.HalfCircleFromCenter:
    case Cam.LeadType.HalfCircle:
        leadAngle = Math.PI;
        break;
    case Cam.LeadType.QuarterCircle:
    case Cam.LeadType.QuarterCircleFromCenter:
        leadAngle = Math.PI/2;
        break;
    case Cam.LeadType.EighthCircle:
    case Cam.LeadType.EighthCircleFromCenter:
        leadAngle = Math.PI/4;
        break;
    default:
        leadAngle = this.getLeadAngle(shape, leadIn);
        if (!isNull(leadAngle)) {
            leadAngle = parseFloat(leadAngle);
        }
        break;
    }
    // start lead in from center, terminate lead out to center:
    leadFromCenter = CamExporterV2.isLeadFromCenter(leadType);
    //    qDebug("type: ", leadType);
    //    qDebug("size: ", leadSize);
    //    qDebug("side: ", leadSide);
    //    qDebug("angle: ", leadAngle);
    var leadShape = undefined;
    var leadShapeFromCenter = undefined;
    var angle;
    var dir;
    if (leadIn) {
        dir = shape.getDirection1();
    }
    else {
        dir = shape.getDirection2() + Math.PI;
    }
    var p;
    if (leadIn) {
        p = shape.getStartPoint();
    }
    else {
        p = shape.getEndPoint();
    }
    var sp;
    // left:
    if (leadDir===Cam.Side.Inside) {
        angle = dir + Math.PI/2;
    }
    // right:
    else {
        angle = dir - Math.PI/2;
    }
    switch (leadType) {
    case Cam.LeadType.None:
        leadShape = undefined;
        break;
    case Cam.LeadType.Extension:
        angle = dir + Math.PI;
        sp = p.operator_add(RVector.createPolar(leadSize, angle));
        leadShape = new RLine(sp, p);
        break;
    case Cam.LeadType.Normal:
        sp = p.operator_add(RVector.createPolar(leadSize, angle));
        leadShape = new RLine(sp, p);
        break;
    case Cam.LeadType.Angular:
    case Cam.LeadType.HalfCircle:
    case Cam.LeadType.QuarterCircle:
    case Cam.LeadType.EighthCircle:
    case Cam.LeadType.HalfCircleFromCenter:
    case Cam.LeadType.QuarterCircleFromCenter:
    case Cam.LeadType.EighthCircleFromCenter:
        // create arc
        sp = p.operator_add(RVector.createPolar(leadSize, angle));
        leadShape = new RArc(sp, sp.getDistanceTo(p), 0, 2*Math.PI, false);
        if (leadDir===Cam.Side.Inside) {
            leadShape.setReversed(false);
            leadShape.setEndAngle(sp.getAngleTo(p));
            leadShape.setStartAngle(leadShape.getEndAngle() - leadAngle);
        }
        else {
            leadShape.setReversed(true);
            leadShape.setEndAngle(sp.getAngleTo(p));
            leadShape.setStartAngle(leadShape.getEndAngle() + leadAngle);
        }
        if (leadFromCenter) {
            leadShapeFromCenter = new RLine(leadShape.getCenter(), leadShape.getStartPoint());
        }
        break;
    }
    // lead out: mirror and reverse:
    if (!leadIn && !isNull(leadShape)) {
        var axis = new RLine(p, p.operator_add(RVector.createPolar(1, dir-Math.PI/2)));
        leadShape.mirror(axis);
        leadShape.reverse();
        if (!isNull(leadShapeFromCenter)) {
            leadShapeFromCenter.mirror(axis);
            leadShapeFromCenter.reverse();
            return [leadShape, leadShapeFromCenter];
        }
    }
    else {
        if (!isNull(leadShapeFromCenter)) {
            return [leadShapeFromCenter, leadShape];
        }
    }
    if (isNull(leadShape)) {
        return [];
    }
    return [ leadShape ];
}
