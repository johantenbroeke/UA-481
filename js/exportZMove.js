function (z, force) {
    if (isNull(force)) {
        force = false;
    }
    if (isNull(z)) {
        qWarning("z move to undefined z level");
        return false;
    }
    //if (RMath.fuzzyCompare(this.cursor.z, z, this.tolerance) &&
    if (RMath.fuzzyCompare(this.cursor.z, z) && !force) {
        // nothing to do:
        return false;
    }
    var dest = this.cursor.copy();
    dest.z = z;
    this.pushContext("CamZMove");
    var camEntity = new RLineEntity(this.camDocument, new RLineData(this.cursor, dest));
    this.exportCamEntity(camEntity, true, true, true, false);
    this.popContext("CamZMove");
    this.cursor.z = z;
    return true;
}
