function () {
    if (this.currentToolpathBlock.hasCustomProperty("QCAD", "CamDrillToolpathFlag")) {
        return Cam.ToolpathType.Drill;
    }
    else if (this.currentToolpathBlock.hasCustomProperty("QCAD", "CamProfileToolpathFlag")) {
        return Cam.ToolpathType.Profile;
    }
    return -1;
}
