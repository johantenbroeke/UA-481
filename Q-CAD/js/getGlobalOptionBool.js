function (name, def) {
    var v = this.getGlobalOption(name, def);
    if (isNull(v)) {
        return v;
    }
    return v===true || v===1 || v==="1" || v==="true";
}
