function (name, id, always, prefix, decimals, options) {
    if (isNull(always)) {
        always = true;
    }
    if (isNull(prefix)) {
        prefix = "";
    }
    if (isNull(decimals)) {
        decimals = 0;
    }
    if (isNull(options)) {
        options = {};
    }
    if (!isNull(this.variables)) {
        this.variables[id] = {};
        this.variables[id].name = name;
        this.variables[id].always = always;
        this.variables[id].prefix = prefix;
        this.variables[id].decimals = decimals;
        this.variables[id].options = options;
    }
}
