function (shape) {
    if (isLineShape(shape) || isArcShape(shape)) {
        this.exportLeadIn(shape);
        this.pushContext("CamFirstSegment");
    }
    this.pushContext("CamFirst");
    this.exportShape(shape);
    this.popContext("CamFirst");
    if (isLineShape(shape) || isArcShape(shape)) {
        this.popContext("CamFirstSegment");
    }
}
