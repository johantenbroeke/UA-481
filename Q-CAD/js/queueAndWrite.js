function (idx, entity, entityNext, propertyName, name) {
    var gotProperty = entity.getCustomProperty("QCAD", propertyName, undefined);
    if (gotProperty==="1") {
        this.notifyUser(qsTranslate('CamExporterV2', "Queueing entity for \"%1\"").arg(name));
        this.queueWriteEntity(idx);
        // detect last matching entity:
        var nextMatches = undefined;
        if (!isNull(entityNext)) {
            nextMatches = entityNext.getCustomProperty("QCAD", propertyName, undefined);
        }
        // write queue:
        if (isNull(nextMatches)) {
            this.notifyUser(qsTranslate('CamExporterV2', "Writing queued entities for \"%1\"").arg(name));
            this.incIndent();
            this.writeBlockFromQueue(propertyName, name);
            this.decIndent();
        }
        return true;
    }
    return false;
}
