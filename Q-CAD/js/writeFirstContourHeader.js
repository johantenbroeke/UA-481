function () {
    if (this.hasBlock("firstContourHeader")) {
        this.writeBlock("firstContourHeader");
    }
    else {
        this.writeBlock("contourHeader");
    }
}
