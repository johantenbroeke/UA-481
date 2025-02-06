function (shape) {
    // ignore xlines and rays:
    if (isXLineShape(shape) || isRayShape(shape)) {
        return;
    }
    if (isLineShape(shape)) {
        this.exportLine(shape);
        return;
    }
    else if (isArcShape(shape)) {
        // interpolate only the offset path if we're exporting the offset, otherwise interpolate the original path:
        if (this.getArcInterpolation()===true && ((this.checkContext("CamOffset") && this.outputOffsetPath) || (!this.checkContext("CamOffset") && !this.outputOffsetPath))) {
            // interpolate arc with line segments:
            var pl = shape.approximateWithLines(this.getArcSegmentLength());
            var plSegments = pl.getExploded();
            for (var k=0; k<plSegments.length; k++) {
                var plSegment = plSegments[k];
                this.exportLine(plSegment);
            }
        }
        else {
            this.exportArc(shape);
        }
        return;
    }
    else if (isPointShape(shape)) {
        this.exportPoint(shape);
        return;
    }
    // export polygon shapes:
    else if (isPolylineShape(shape)) {
        // look at context for contours consisting of multiple connected polylines:
        var segments = shape.getExploded();
        for (var i=0; i<segments.length; i++) {
            var segment = segments[i];
            // single polyline with one segment:
            if (i===0 && segments.length===1) {
                this.exportSingleContourShape(segment);
                break;
            }
            if (i===0) {
                // first segment of single polyline:
                if (this.checkContext("CamSingle")) {
                    if (shape.isGeometricallyClosed()) {
                        this.exportFirstClosedContourShape(segment);
                    }
                    else {
                        this.exportFirstOpenContourShape(segment);
                    }
                    continue;
                }
                // first segment of polyline as first shape of contour:
                else if (this.checkContext("CamFirst")) {
                    // polyline is first shape of closed contour:
                    if (this.checkContext("CamClosedContour")) {
                        this.exportFirstClosedContourShape(segment);
                        continue;
                    }
                    // polyline is first shape of open contour:
                    else if (this.checkContext("CamOpenContour")) {
                        this.exportFirstOpenContourShape(segment);
                        continue;
                    }
                }
            }
            else if (i===segments.length-1) {
                // last segment of single polyline:
                if (this.checkContext("CamSingle")) {
                    if (shape.isGeometricallyClosed()) {
                        this.exportLastClosedContourShape(segment);
                    }
                    else {
                        this.exportLastOpenContourShape(segment);
                    }
                    continue;
                }
                // last segment of polyline as last shape of contour:
                else if (this.checkContext("CamLast")) {
                    // polyline is last shape of closed contour:
                    if (this.checkContext("CamClosedContour")) {
                        this.exportLastClosedContourShape(segment);
                        continue;
                    }
                    // polyline is last shape of closed contour:
                    else if (this.checkContext("CamOpenContour")) {
                        this.exportLastOpenContourShape(segment);
                        continue;
                    }
                }
            }
            // single polyline:
            if (this.checkContext("CamSingle")) {
                if (shape.isGeometricallyClosed()) {
                    this.exportClosedContourShape(segment);
                }
                else {
                    this.exportOpenContourShape(segment);
                }
            }
            // polyline is part of closed contour:
            else if (this.checkContext("CamClosedContour")) {
                this.exportClosedContourShape(segment);
            }
            // polyline is part of open contour:
            else if (this.checkContext("CamOpenContour")) {
                this.exportOpenContourShape(segment);
            }
        }
        return;
    }
    // export spline as polyline:
    else if (isSplineShape(shape)) {
        // spline might be close approximation of line or arc:
        var lineArcSpline = ShapeAlgorithms.splineToLineOrArc(shape, this.getTolerance());
        if (isSplineShape(lineArcSpline)) {
            // convert spline to polyline with bi-arc segments:
            var splinePl = shape.approximateWithArcs(this.getSplineTolerance(), this.getSplineMaxRadius());
            this.exportShape(splinePl);
        }
        else {
            this.exportShape(lineArcSpline);
        }
    }
    // export ellipse as polyline:
    else if (isEllipseShape(shape)) {
        var ellipsePl = shape.approximateWithArcs(this.getEllipseSegments());
        this.exportShape(ellipsePl);
    }
}
