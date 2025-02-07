function (name) {
    // init block file names for this config on first call:
    if (isNull(this.blockFileNames)) {
        var dir = new QDir("postprocessors");
        var fs = new QDir.Filters(QDir.NoDotAndDotDot, QDir.Readable, QDir.Files);
        var sf = new QDir.SortFlags(QDir.Name);
        var pattern = this.toString() + "_*" + this.fileExtensions[0];
        this.blockFileNames = dir.entryList(pattern, fs, sf);
    }
    var ret = [];
    var rexp, i, fn;
    // look for files named "MyGCode_001_header.nc", "MyGCode_002_header.nc", ...:
    rexp = new RegExp(this.toString() + "_" + "[0-9]*" + "_" + name + "\\." + this.fileExtensions[0]);
    for (i=0; i<this.blockFileNames.length; i++) {
        fn = this.blockFileNames[i];
        if (fn.match(rexp)) {
            ret.push(fn);
        }
    }
    if (ret.length===0) {
        // look for files named "MyGCode_header.nc":
        rexp = new RegExp(this.toString() + "_" + name + "\\." + this.fileExtensions[0]);
        for (i=0; i<this.blockFileNames.length; i++) {
            fn = this.blockFileNames[i];
            if (fn.match(rexp)) {
                ret.push(fn);
            }
        }
    }
    return ret;
}
