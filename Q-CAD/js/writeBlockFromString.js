function (blockStrings) {
    if (isNull(blockStrings)) {
        return;
    }
    if (isString(blockStrings)) {
        blockStrings = [ blockStrings ];
    }
    for (var i=0; i<blockStrings.length; i++) {
        // blockString
        // e.g. "[N] G01 [X] [Y]"
        var blockString = blockStrings[i];
        if (blockString.indexOf("[")===-1) {
            // blockString contains no tags:
            this.writeLine(blockString);
            continue;
        }
        var lineNumberString = undefined;
        for (var id in this.variables) {
            if (blockString.indexOf("[")===-1) {
                // no more tags in blockString:
                break;
            }
            // variable name (e.g. "lineNumber"):
            var varName = this.variables[id].name;
            //qDebug("varName: ", varName);
            // allow for max. 10 combinations of id with #,!,- on one line:
            for (var k=0; k<10; k++) {
                if (blockString.indexOf("[")===-1) {
                    // all tags replaced:
                    break;
                }
                // match any combination of tags and flags:
                var rx = new RegExp("\\[" + id + "([!#-]*)?\\]", "g");
                if (!rx.test(blockString)) {
                    // all tags replaced:
                    break;
                }
//                if (id==="FP") {
//                    debugger;
//                }
    //            if (blockString.indexOf("G00")!==-1) {
    //                if (id==="X") {
    //                    debugger;
    //                }
    //            }
                // reset regexp:
                rx.lastIndex = 0;
                // bang after variable name overrides force:
                var forceAlways = false;
                var noPrefix = false;
                var negate = false;
                var match = rx.exec(blockString);
                if (!isNull(match) && match.length===2) {
                    // second match of regular expression is the exclamation mark or hash
                    // (capture group):
                    if (match[1].indexOf("!")!==-1) {
                        forceAlways = true;
                    }
                    if (match[1].indexOf("#")!==-1) {
                        noPrefix = true;
                        forceAlways = true;
                    }
                    if (match[1].indexOf("-")!==-1) {
                        negate = true;
                    }
                }
    //            if (blockString.contains("[F]") && varName==="feedRate") {
    //                debugger;
    //            }
                // write always or only when changed:
                var always = forceAlways || this.variables[id].always;
                // prefix (e.g. "L"):
                var prefix = noPrefix ? "" : this.variables[id].prefix;
                // value decimals (e.g. 3 or 4):
                var decimals = this.variables[id].decimals;
                if (decimals==="DEFAULT") {
                    decimals = this.decimals;
                }
                // additional formatting options:
                var options = this.variables[id].options;
                if (options==="DEFAULT") {
                    options = this.options;
                }
                var value = this[varName];
                var formattedValue = undefined;
                var valueString;
                if (isString(value)) {
                    // string (e.g. fileName):
                    valueString = prefix + value;
                }
                else if (isNumber(value)) {
                    // number (e.g. coordinate):
                    if (negate) {
                        value = -value;
                    }
                    formattedValue = this.formatValue(value, decimals, options);
                    valueString = prefix + formattedValue;
                    if (!always && this.variables[id].previous===formattedValue) {
                        valueString = "";
                    }
                }
                else {
                    // special case:
                    // null value means skip (used for unknown position at start):
                    valueString = "";
                }
//                if (id==="SWEEP") {
//                    debugger;
//                }
                // replace e.g. "[T]" with "T1":
                // or "[T#]" with "1":
                blockString = blockString.replace(match[0], valueString);
                this.variableUsed(id, valueString);
                this.variables[id].previous = formattedValue;
                if (varName==="lineNumber") {
                    lineNumberString = formattedValue;
                    this.lineNumber += this.lineNumberIncrement;
                }
            }
            // no brackets means we're done, no more variables:
            if (blockString.indexOf("[")===-1 || blockString.indexOf("]")===-1) {
                break;
            }
        }
        // normalize space:
        if (this.normalizeWhiteSpace!==false) {
            blockString = blockString.replace(/\s+/g, ' ');
        }
        // if all that is left is the line number, skip this line:
        if (blockString===lineNumberString) {
            continue;
        }
        this.writeLine(blockString);
    }
}
