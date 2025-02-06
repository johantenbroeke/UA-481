function () {
    if (!isNull(this.transformationScale)) {
        // cache:
        return this.transformationScale;
    }
    var unitScale = this.getUnitScale();
    if (isNull(unitScale)) {
        var outputUnit = this.getUnit();
        if (outputUnit!==RS.None) {
            unitScale = RUnit.convert(1.0, this.getDocument().getUnit(), outputUnit);
        }
        else {
            // output unit is None (default, no scale):
            unitScale = 1.0;
        }
    }
    qDebug("unitScale:", unitScale);
    qDebug("this.getScale():", this.getScale());
    this.transformationScale = this.getScale() * unitScale;
    return this.transformationScale;
}
