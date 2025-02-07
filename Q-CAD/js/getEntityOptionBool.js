function (entity, name, def) {
    var v = this.getEntityOption(entity, name, def/*, step*/);
    if (isNull(v)) {
        return v;
    }
    return parseInt(v, 10)===1;
}
