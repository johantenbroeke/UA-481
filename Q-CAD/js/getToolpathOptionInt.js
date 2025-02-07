function (name, def) {
    var v = this.getToolpathOption(name, def);
    if (isNull(v)) {
        return v;
    }
    return parseInt(v, 10);
}
