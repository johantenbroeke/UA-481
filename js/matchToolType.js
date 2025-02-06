function (toolType, toolTypeFilter) {
    if (toolTypeFilter===Cam.ToolTypeFilter.All) {
        return true;
    }
    return toolType===toolTypeFilter;
}
