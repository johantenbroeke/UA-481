function () {
    if (this.firstEntityOfProfile && this.lastEntityOfProfile) {
        if (this.hasBlock("firstLastOfProfileArcCCWMove")) {
            this.writeBlock("firstLastOfProfileArcCCWMove");
            this.lastMoveGCode = 3;
            return;
        }
    }
    else if (this.firstEntityOfProfile) {
        if (this.hasBlock("firstOfProfileArcCCWMove")) {
            this.writeBlock("firstOfProfileArcCCWMove");
            this.lastMoveGCode = 3;
            return;
        }
    }
    else if (this.lastEntityOfProfile) {
        if (this.hasBlock("lastOfProfileArcCCWMove")) {
            this.writeBlock("lastOfProfileArcCCWMove");
            this.lastMoveGCode = 3;
            return;
        }
    }
    this.writeBlock("firstArcCCWMove");
    this.lastMoveGCode = 3;
}
