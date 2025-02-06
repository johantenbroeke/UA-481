function () {
    if (this.firstEntityOfProfile && this.lastEntityOfProfile) {
        if (this.hasBlock("firstLastOfProfileArcCWMove")) {
            this.writeBlock("firstLastOfProfileArcCWMove");
            this.lastMoveGCode = 2;
            return;
        }
    }
    else if (this.firstEntityOfProfile) {
        if (this.hasBlock("firstOfProfileArcCWMove")) {
            this.writeBlock("firstOfProfileArcCWMove");
            this.lastMoveGCode = 2;
            return;
        }
    }
    else if (this.lastEntityOfProfile) {
        if (this.hasBlock("lastOfProfileArcCWMove")) {
            this.writeBlock("lastOfProfileArcCWMove");
            this.lastMoveGCode = 2;
            return;
        }
    }
    this.writeBlock("firstArcCWMove");
    this.lastMoveGCode = 2;
}
