function (name, map) {
    if (isNull(map)) {
        map = true;
    }
    if (map) {
        name = this.mapBlockName(name);
    }
    var fns = this.getBlockFileNames(name);
    return fns.length>0;
}
