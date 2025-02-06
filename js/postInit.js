function (dialog) {
    var ret = CamExporterV2.prototype.postInit.call(this, dialog);
    if (this.alwaysWriteG1===true) {
        this.cadDocument.setVariable(Cam.getCurrentVariablePrefix() + "AlwaysWriteG1", true);
    }
    // save original text blocks for skipping G1:
    // needed to restore if always write G1 is switched off:
    if (isNull(this.linearMoveOri)) {
        this.linearMoveOri = this.linearMove;
        this.linearMoveZOri = this.linearMoveZ;
        this.pointMoveZOri = this.pointMoveZ;
    }
    return ret;
}
