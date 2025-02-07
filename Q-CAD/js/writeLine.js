function (line) {
    if (isNull(line)) {
        line = "";
    }
    // trim spaces from start:
    if (this.trimSpacesStart!==false) {
        line = line.replace(/^ +/g, '');
    }
    // trim spaces from end:
    if (this.trimSpacesEnd!==false) {
        line = line.replace(/ +$/g, '');
    }
    for (var i=0; i<this.ignoredOutput.length; i++) {
        var rx = new RegExp("^" + this.ignoredOutput[i] + "$");
        if (rx.test(line)) {
            return;
        }
    }
    this.write(line + this.lineEnding);
    // only attach G Code output to entities if offset path is output
    // otherwise, there is no 1:1 relationship between output and simulated offset path:
//    if (this.outputOffsetPath) {
//        var e = this.getCurrentEntity();
//        if (!isNull(e)) {
//            // TODO: add line number as direct reference to output file
//            e.setCustomProperty("QCAD", "CamOutput", line);
//            this.opWrite.addObject(e.clone(), false);
//        }
//    }
    this.lastWrittenLine = line;
}
