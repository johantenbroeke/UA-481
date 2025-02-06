function (point) {
    var dest = point.getPosition();
    //var c = this.context;
    //this.context = [];
    this.exportRapidMoveTo(dest);
    //this.context = c;
    this.pushContext("CamPoint");
    this.exportToolDown();
    this.exportToolUp();
    this.popContext("CamPoint");
}
