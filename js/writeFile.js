function (fileName) {
    if (this.getGlobalOption("AlwaysWriteG1", false)===true) {
        this.linearMove = this.firstLinearMove;
        this.linearMoveZ = this.firstLinearMoveZ;
        this.pointMoveZ = this.firstPointMoveZ;
    }
    else {
        this.linearMove = this.linearMoveOri;
        this.linearMoveZ = this.linearMoveZOri;
        this.pointMoveZ = this.pointMoveZOri;
    }
    return CamExporterV2.prototype.writeFile.call(this, fileName);
}
