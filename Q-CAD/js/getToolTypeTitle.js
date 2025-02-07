function (toolType) {
    if (isString(toolType)) {
        toolType = parseInt(toolType);
    }
    switch (toolType) {
    case Cam.ToolType.Mill:
        return qsTranslate('CamExporterV2', "Mill");
    case Cam.ToolType.Drill:
        return qsTranslate('CamExporterV2', "Drill");
    default:
        return qsTranslate('CamExporterV2', "Unknown");
    }
}
