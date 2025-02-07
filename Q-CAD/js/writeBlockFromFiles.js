function (name) {
    var fileNames = this.getBlockFileNames(name);
    for (var i=0; i<fileNames.length; i++) {
        this.blockFileName = fileNames[i];
        var file = new QFile("postprocessors/" + this.blockFileName);
        if (!file.exists()) {
            this.warnUser(qsTranslate('CamExporterV2', "File does not exist:") + " " + this.blockFileName);
            continue;
        }
        var flags = new QIODevice.OpenMode(QIODevice.ReadOnly | QIODevice.Text);
        var contents = "";
        if (file.open(flags)) {
            contents = file.readAll().toString();
            file.close();
        }
        else {
            this.notifyUser(qsTranslate('CamExporterV2', "File cannot be opened for reading:") + " " + this.blockFileName);
            continue;
        }
        var lines = contents.split("\n");
        // remove last line if empty (from line feed at end of line):
        if (lines.length>0) {
            if (lines[lines.length-1].length===0) {
                lines.pop();
            }
            this.writeBlockFromString(lines);
        }
    }
}
