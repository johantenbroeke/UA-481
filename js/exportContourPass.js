function (contour, shapeIndex) {
    if (isNull(shapeIndex)) {
        shapeIndex = 0;
    }
    var shape;
    var k;
    if (this.getSide()!==Cam.Side.None) {
        this.pushContext("CamNotOffset");
    }
    // contours with one shape (point, circle, spline, one line, one arc, ...):
    if (contour.shapes.length===1) {
        // export:
        shape = contour.getFirstShape();
        this.exportSingleContourShape(shape);
    }
    // open contour:
    else if (!contour.isClosed(this.getTolerance())) {
        this.pushContext("CamOpenContour");
        if (shapeIndex===0) {
            // export open contour in original order:
            for (k=0; k<contour.shapes.length; k++) {
                shape = contour.shapes[k];
                if (k===0) {
                    this.notifyUser(qsTranslate('CamExporterV2', "Starting at:") + " " + coordinateToString(shape.getStartPoint()));
                    this.exportFirstOpenContourShape(shape);
                }
                else if (k===contour.shapes.length-1) {
                    this.exportLastOpenContourShape(shape);
                }
                else {
                    this.exportOpenContourShape(shape);
                }
            }
        }
        else {
            // export open contour reversed:
            for (k=contour.shapes.length-1; k>=0; k--) {
                shape = contour.shapes[k].clone();
                shape.reverse();
                if (k===contour.shapes.length-1) {
                    this.notifyUser(qsTranslate('CamExporterV2', "Starting at:") + " " + coordinateToString(shape.getStartPoint()));
                    this.exportFirstOpenContourShape(shape);
                }
                else if (k===0) {
                    this.exportLastOpenContourShape(shape);
                }
                else {
                    this.exportOpenContourShape(shape);
                }
            }
        }
        this.popContext("CamOpenContour");
    }
    // closed contour:
    else {
        this.pushContext("CamClosedContour");
        for (k=shapeIndex; k<contour.shapes.length + shapeIndex; k++) {
            var index = k % contour.shapes.length;
            shape = contour.shapes[index];
            // first entity of contour:
            if (k===shapeIndex) {
                this.notifyUser(qsTranslate('CamExporterV2', "Starting at:") + " " + coordinateToString(shape.getStartPoint()));
                this.exportFirstClosedContourShape(shape);
            }
            // last entity of contour:
            else if (k===contour.shapes.length + shapeIndex-1) {
                this.exportLastClosedContourShape(shape);
            }
            // entities in between:
            else {
                this.exportClosedContourShape(shape);
            }
        }
        this.popContext("CamClosedContour");
    }
    if (this.getSide()!==Cam.Side.None) {
        this.popContext("CamNotOffset");
    }
    if (this.getSide()!==Cam.Side.None) {
        this.notifyUser(qsTranslate('CamExporterV2', "Exporting offset path"));
        this.incIndent();
        this.pushContext("CamOffset");
        this.exportOffsetPath();
        this.popContext("CamOffset");
        this.decIndent();
    }
}
