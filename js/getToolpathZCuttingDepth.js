function () {
    var zCuttingDepth = undefined;
    var toolType = this.getCurrentToolType();
    if (this.isDrillTool(toolType)) {
        // for drill toolpaths: try parameter drilling depth first:
        zCuttingDepth = this.getToolpathOptionFloat("CamZDrillingDepth", undefined);
    }
    if (isNull(zCuttingDepth)) {
        // no drilling depth or not a drilling toolpath, use cutting depth:
        zCuttingDepth = this.getToolpathOptionFloat("CamZCuttingDepth", undefined);
    }
    return zCuttingDepth;
}
