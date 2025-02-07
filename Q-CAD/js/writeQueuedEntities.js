function () {
    var tmp = this.writeEntityIndex;
    for (var i=0; i<this.writeQueue.length; i++) {
        this.writeEntityIndex = this.writeQueue[i];
        //var e = this.writeQueue[i];
        var subId = this.writeEntityIds[this.writeEntityIndex];
        var e = this.camDocument.queryEntityDirect(subId);
        this.initEntity(e);
        this.writeEntity();
    }
    this.writeEntityIndex = tmp;
    this.writeQueue = [];
}
