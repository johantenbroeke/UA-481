function (name, def) {
    var v = this.getGlobalOption(name, def);
    if (isNull(v)) {
        return v;
    }
    return parseInt(v, 10);
}
