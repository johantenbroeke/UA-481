function (fileName) {
    // (re-)initialize zSafety from CAM config:
    var v = this.camDocument.getVariable(Cam.getCurrentVariablePrefix() + "CamZSafety", this.zSafety);
    v = parseFloat(v);
    if (isNumber(v)) {
        this.zSafety = v;
    }
}
