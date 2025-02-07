function () {
    var x = this.getGlobalOptionFloat("CamHomeX", 0.0);
    var y = this.getGlobalOptionFloat("CamHomeY", 0.0);
    //var z = this.getGlobalOptionFloat("CamZSafety", 100.0);
    var z = this.getSafetyLevel();
    return new RVector(x,y,z);
}
