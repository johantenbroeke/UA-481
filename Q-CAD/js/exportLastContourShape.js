function (shape) {
    if (isLineShape(shape) || isArcShape(shape)) {
        this.pushContext("CamLastSegment");
    }
    this.pushContext("CamLast");
    this.exportShape(shape);
    this.popContext("CamLast");
    if (isLineShape(shape) || isArcShape(shape)) {
        this.popContext("CamLastSegment");
        this.exportLeadOut(shape);
    }
}
