function (name, def) {
    return this.cadDocument.getVariable(this.getCustomPropertyPrefix(true) + name, def);
}
