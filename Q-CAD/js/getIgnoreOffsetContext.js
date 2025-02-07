function () {
    // no offset path (on path):
    // never ignore:
    if (!this.hasOffsetPath()) {
        return false;
    }
    // offset path is output:
    // ignore everything that is not offset:
    if (this.outputOffsetPath) {
        if (this.checkContext("CamNotOffset")) {
            return true;
        }
    }
    // original path is output:
    // ignore offset paths:
    else {
        if (this.checkContext("CamOffset")) {
            return true;
        }
    }
    return false;
}
