function (leadShapes, offsetShapes, leadType, hasOvercutShape, leadIn) {
    // trim offset shapes:
    for (var i=0; i<offsetShapes.length-1; i++) {
        var offsetShape = offsetShapes[i];
        var nextOffsetShape = offsetShapes[i+1];
        // shapes connect already: nothing to do:
        if (offsetShape.getEndPoint().equalsFuzzy(nextOffsetShape.getStartPoint(), 0.0001)) {
            continue;
        }
        // shapes intersect: trim:
        var ips = offsetShape.getIntersectionPoints(nextOffsetShape.data());
        if (ips.length===1) {
            var ip = ips[0];
            offsetShape.trimEndPoint(ip);
            nextOffsetShape.trimStartPoint(ip);
        }
        // shapes don't intersect: force connection:
        else {
            if (leadIn) {
                if (isLineShape(offsetShape)) {
                    offsetShape.setEndPoint(nextOffsetShape.getStartPoint());
                }
                if (isArcShape(offsetShape)) {
                    offsetShape.moveEndPoint(nextOffsetShape.getStartPoint());
                }
            }
            else {
                if (isLineShape(nextOffsetShape)) {
                    nextOffsetShape.setStartPoint(offsetShape.getEndPoint());
                }
                if (isArcShape(nextOffsetShape)) {
                    nextOffsetShape.moveStartPoint(offsetShape.getEndPoint());
                }
            }
        }
    }
}
