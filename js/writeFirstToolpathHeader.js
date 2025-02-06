function () {
    if (this.hasBlock("firstToolpathHeader")) {
        this.writeBlock("firstToolpathHeader");
    }
    else {
        this.writeToolpathHeader();
    }
}
