function (shape) {
    var blockRefIds = this.cadDocument.queryAllEntities(false, true, RS.EntityBlockRef);
    var ret = [];
    for (var i=0; i<blockRefIds.length; i++) {
        var blockRefId = blockRefIds[i];
        var blockRef = this.cadDocument.queryEntityDirect(blockRefId);
        if (!isBlockReferenceEntity(blockRef)) {
            // not a block ref:
            continue;
        }
        if (!blockRef.isVisible()) {
            // 20220727: ignore invisible tabs:
            continue;
        }
        if (blockRef.getCustomBoolProperty("QCAD", "CamTabFlag", false)!==true) {
            // not a tab:
            continue;
        }
        ret.push(blockRef);
    }
    return ret;
}
