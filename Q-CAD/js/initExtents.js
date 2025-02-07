function () {
    var bb = new RBox();
    var toolpathBlocks = Cam.getToolpathBlocks(this.camDocument);
    for (var i=0; i<toolpathBlocks.length; i++) {
        var toolpathBlock = toolpathBlocks[i];
        var ids = this.camDocument.queryBlockEntities(toolpathBlock.getId());
        for (var k=0; k<ids.length; k++) {
            var bbEntity = this.camDocument.queryEntityDirect(ids[k]);
            bb.growToIncludeBox(bbEntity.getBoundingBox());
        }
    }
    this.xMin = bb.getMinimum().x;
    this.yMin = bb.getMinimum().y;
    this.zMin = bb.getMinimum().z;
    this.xMax = bb.getMaximum().x;
    this.yMax = bb.getMaximum().y;
    this.zMax = bb.getMaximum().z;
}
