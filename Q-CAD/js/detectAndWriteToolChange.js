function (toolHeaderWritten) {
    if (!toolHeaderWritten) {
        // tool header:
        if (!isNull(this.tool) && this.tool!==this.toolPrev) {
            // e.g. tool change:
            // before toolpath header:
            // before rapid moves:
            this.notifyUser(qsTranslate('CamExporterV2', "Writing tool header for tool %1").arg(this.tool));
            this.incIndent();
            this.writeToolHeader();
            return true;
        }
    }
    return false;
}
