function (name) {
    if (isNull(name)) {
        return;
    }
    //qDebug("writeBlock:", name);
    // check balance of headers / footers:
    if (name.endsWith("Header")) {
        this.writeStack.push(name);
    }
    if (name.endsWith("Footer")) {
        if (this.writeStack.length===0) {
            debugger;
        }
        var thisName = name.replace("First", "").replace("Last", "").replace("Footer", "Header");
        var prevName = this.writeStack.pop();
        if (!isNull(prevName)) {
            prevName = prevName.replace("First", "").replace("Last", "");
        }
        if (prevName!==thisName) {
            // header / footer mismatch:
            qWarning("================== header / footer mismatch - got:", name, "expected:", isNull(prevName) ? "NULL" : prevName.replace("Header", "Footer"));
            //debugger;
        }
    }
    name = this.mapBlockName(name);
    // current block name (can be used in output):
    this.blockName = name;
    this.blockFileName = undefined;
    // look up include file (e.g. from file in this.headerFile):
    if (this.hasBlockFile(name)) {
        this.writeBlockFromFiles(name);
    }
    else {
        if (this.__debug__===true) {
            this.writeComment(name);
        }
        this.writeBlockFromString(this[name]);
    }
}
