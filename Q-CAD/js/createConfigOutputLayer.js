function () {
    // create root layer "CAM", locked and not snappable:
    var outCamLayerName = "CAM";
    this.createLayer(outCamLayerName, new RColor("white"), undefined, { "locked" : true, "snappable" : false });
    // create layer "CAM ... GCode"
    var outConfigLayerName = this.getCamConfigLayerName();
    this.createLayer(outConfigLayerName, new RColor("white"));
    return outConfigLayerName;
}
