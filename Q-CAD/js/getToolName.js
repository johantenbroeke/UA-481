function (toolBlockName) {
    var parts = toolBlockName.split(Cam.blockNameSeparator);
    if (parts.length>=3) {
        return parts[2];
    }
    return undefined;
}
