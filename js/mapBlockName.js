function (name) {
    if (isNull(this.blockNameMapping[name])) {
        return name;
    }
    return this.blockNameMapping[name];
}
