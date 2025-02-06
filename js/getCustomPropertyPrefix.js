function (global) {
    if (this.writingOutput===true && global!==true) {
        // no prefix when writing output (CamTool, CamRapidMove, ...):
        return "";
    }
    // use Cam/ConfigurationName prefix when creating output document:
    return "Cam/" + this.getConfigName() + "/";
}
