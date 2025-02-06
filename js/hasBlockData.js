function (name, map) {
    if (isNull(map)) {
        map = true;
    }
    if (map) {
        name = this.mapBlockName(name);
    }
    return !isNull(this[name]);
}
