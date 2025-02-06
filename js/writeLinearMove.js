function () {
    if (this.firstEntityOfProfile && this.lastEntityOfProfile) {
        if (this.hasBlock("firstLastOfProfileLinearMove")) {
            this.writeBlock("firstLastOfProfileLinearMove");
            this.lastMoveGCode = 1;
            return;
        }
    }
    else if (this.firstEntityOfProfile) {
        if (this.hasBlock("firstOfProfileLinearMove")) {
            this.writeBlock("firstOfProfileLinearMove");
            this.lastMoveGCode = 1;
            return;
        }
    }
    else if (this.lastEntityOfProfile) {
        if (this.hasBlock("lastOfProfileLinearMove")) {
            this.writeBlock("lastOfProfileLinearMove");
            this.lastMoveGCode = 1;
            return;
        }
    }
    this.writeBlock("linearMove");
    this.lastMoveGCode = 1;
}
