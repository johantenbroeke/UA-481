function () {
    var overcut = this.getToolpathOptionFloat("CamOvercut", 0.0);
    if (Math.abs(overcut)<1.0e-6) {
        return false;
    }
    return true;
}
