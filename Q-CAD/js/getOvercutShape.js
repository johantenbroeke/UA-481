function (shape, leadIn) {
    var overcutShape = shape.clone();
    var leadType = this.getLeadType(leadIn);
    var overcut = this.getToolpathOptionFloat("CamOvercut", 0.0);
    if (Math.abs(overcut)<1.0e-6 /*|| leadType===Cam.LeadType.None*/) {
        return undefined;
    }
    var pts;
    if (leadIn) {
        // extend entity at start by overcut:
        pts = shape.getPointsWithDistanceToEnd(-overcut, RS.FromStart);
        if (pts.length===1) {
            overcutShape.trimStartPoint(pts[0], pts[0], true);
            overcutShape.trimEndPoint(shape.getStartPoint());
        }
    }
    else {
        // extend entity at end by overcut:
        pts = shape.getPointsWithDistanceToEnd(-overcut, RS.FromEnd);
        if (pts.length===1) {
            //entity.trimEndPoint(pts[0], pts[0], true);
            overcutShape.trimEndPoint(pts[0], pts[0], true);
            overcutShape.trimStartPoint(shape.getEndPoint());
        }
    }
    return overcutShape;
}
