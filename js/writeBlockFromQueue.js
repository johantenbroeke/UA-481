function (blockName, name) {
    this.writeBlockHeader(blockName);
    this.writeQueuedEntities();
    this.writeBlockFooter(blockName);
}
