function (leadShapes, offsetShapes, offsetBaseShapeUntrimmed, leadIn) {
    var arc;
    var leadShape;
    var offsetShape;
    if (leadIn) {
        leadShape = leadShapes[0];
        offsetShape = offsetShapes[0];
        // direct radius compensation:
        // add line from programmed position to offset position:
//        if (this.directRadiusCompensation) {
//            offsetShapes.unshift(new RLine(leadShape.getStartPoint(), offsetShape.getStartPoint()));
//        }
//        else {
            // regular radius compensation:
            // move start point of offset shape to not offset start point:
            if (isLineShape(offsetShape)) {
                if (!this.outputOffsetPath) {
                    offsetShape.setStartPoint(leadShape.getStartPoint());
                }
            }
            if (isArcShape(offsetShape)) {
                //offsetShape.moveStartPoint(leadShape.getStartPoint());
                arc = CamExporterV2.getOffsetLeadArc(
                            leadShape.getStartPoint(),
                            leadShape.getDirection2() + Math.PI,
                            offsetBaseShapeUntrimmed.getStartPoint(),
                            leadIn);
                offsetShapes[0] = arc;
            }
//        }
    }
    else {
        leadShape = leadShapes[leadShapes.length-1];
        offsetShape = offsetShapes[offsetShapes.length-1];
        // direct radius compensation:
        // add line from programmed position to offset position:
//        if (this.directRadiusCompensation) {
//            offsetShapes.push(new RLine(offsetShape.getEndPoint(), leadShape.getEndPoint()));
//        }
//        else {
            // regular radius compensation:
            // move end point of offset shape to not offset end point:
            if (isLineShape(offsetShape)) {
                if (!this.outputOffsetPath) {
                    offsetShape.setEndPoint(leadShape.getEndPoint());
                }
            }
            if (isArcShape(offsetShape)) {
                //offsetShape.moveEndPoint(leadShape.getEndPoint());
                arc = CamExporterV2.getOffsetLeadArc(
                            leadShape.getEndPoint(),
                            leadShape.getDirection1() + Math.PI,
                            offsetBaseShapeUntrimmed.getEndPoint(),
                            leadIn);
                offsetShapes[offsetShapes.length-1] = arc;
            }
//        }
    }
}
