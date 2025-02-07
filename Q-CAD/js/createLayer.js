function (layerName, color, linetype, options) {
    // check if layer exists already:
    var layerId = this.camDocument.getLayerId(layerName);
    if (layerId!==RObject.INVALID_ID) {
        return layerId;
    }
    if (isNull(options)) {
        options = {};
    }
    if (isNull(linetype)) {
        linetype = "continuous";
    }
    if (isNull(options.lineweight)) {
        options.lineweight = RLineweight.Weight020;
    }
    if (isNull(options.locked)) {
        options.locked = false;
    }
    if (isNull(options.snappable)) {
        options.snappable = true;
    }
    if (isNull(options.off)) {
        options.off = false;
    }
    var linetypeId = this.camDocument.getLinetypeId(linetype);
    if (linetypeId===RObject.INVALID_ID) {
        linetypeId = this.camDocument.getLinetypeId("continuous");
    }
    var layer = new RLayer(
        this.camDocument,
        layerName,
        options.off, options.locked,
        color,
        linetypeId,
        options.lineweight,
        options.off
    );
    layer.setSnappable(options.snappable);
    layer.setCustomProperty("QCAD", "ScreenBasedLinetypes", "1");
//    if (this.duringRapidMove===true) {
//        layer.setCustomProperty("QCAD", "CamRapidMove", "1");
//    }
    var op = new RAddObjectOperation(layer);
    op.setAllowInvisible(true);
    op.setAllowAll(true);
    op.setTransactionGroup(this.camDocument.getTransactionGroup());
    op.setText(qsTranslate('CamExporterV2', "Add CAM layer %1").arg(layerName));
    this.camDocumentInterface.applyOperation(op);
    return this.camDocument.getLayerId(layerName);
}
