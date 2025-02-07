function (name, def) {
    var v = this.getToolpathOption(name, def);
    if (isNull(v)) {
        return v;
    }
    var ret = parseFloat(v, 10);
    if (isNaN(ret)) {
        return def;
    }
    return ret;
}
