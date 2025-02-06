function (shape) {
    this.pushContext("CamSingle");
    if (isLineShape(shape) || isArcShape(shape)) {
        this.exportLeadIn(shape);
        this.pushContext("CamFirstSegment");
        this.pushContext("CamLastSegment");
    }
    this.pushContext("CamFirst");
    this.pushContext("CamLast");
    this.exportShape(shape);
    this.popContext("CamLast");
    this.popContext("CamFirst");
    if (isLineShape(shape) || isArcShape(shape)) {
        this.exportLeadOut(shape);
        this.popContext("CamLastSegment");
        this.popContext("CamFirstSegment");
    }
    this.popContext("CamSingle");
}
