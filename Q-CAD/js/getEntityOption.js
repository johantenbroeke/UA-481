function (entity, name, def) {
    if (isNull(entity)) {
        return def;
    }
    // default to layer value:
    //def = this.getLayerOption(entity, name, def);
    // entity specific value:
    return entity.getCustomProperty(
                "QCAD",
                name,
                //this.getCustomPropertyPrefix(step) + name,
                def);
}
