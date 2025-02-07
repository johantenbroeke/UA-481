function () {
    // place output on layer CAM/[config name]/...
    var prefix = this.getCamConfigLayerName() + RLayer.getHierarchySeparator();
    if (this.checkContext("CamRapidMove")) {
        return this.createLayer(prefix + "rapid", new RColor("#0088FF"), "DASHDOT2");
    }
    else {
        //if (this.duringOffset===true) {
        if (this.checkContext("CamOffset")) {
            return this.createLayer(prefix + "offset", new RColor("white"), "DASHED2");
        }
        return this.createLayer(prefix + "normal", new RColor("gray"), "CONTINUOUS");
    }
}
