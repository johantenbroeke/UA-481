function (name, def) {
    var v = this.getGlobalOption(name, def);
    if (isNull(v)) {
        return v;
    }
    v = parseFloat(v, 10);
    if (!isNumber(v)) {
        qWarning("not a valid number: ", v);
    }
    return v;
}
