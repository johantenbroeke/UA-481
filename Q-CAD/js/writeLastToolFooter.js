function () {
    if (this.hasBlock("lastToolFooter")) {
        this.writeBlock("lastToolFooter");
    }
    else {
        this.writeBlock("toolFooter");
    }
}
