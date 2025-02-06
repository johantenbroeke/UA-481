function (value, decimals, options) {
    var sign = options.sign===true;
    var width = options.width;
    if (isNull(width)) {
        width = 0;
    }
    var leadingZeroes = options.leadingZeroes===true;
    var trailingZeroes = options.trailingZeroes===true;
    var decimalSeparator = options.decimalSeparator;
    var factor = options.factor;
    if (!isNull(factor)) {
        value *= factor;
    }
    var printfFormat = "%";
    if (sign) {
        // e.g. "%+f":
        printfFormat += "+";
    }
    if (decimals===0 || isNull(decimals)) {
        if (width>0) {
            if (leadingZeroes) {
                // e.g. "%03d":
                printfFormat += "0";
            }
            // e.g. "%3d" or "%03d":
            printfFormat += width.toString();
        }
        printfFormat += "d";
    }
    else {
        printfFormat += "." + decimals + "f";
    }
    var ret = sprintf2(printfFormat, value);
    if (decimals!==0 && !trailingZeroes) {
        // strip trailing zeros ('1.000' -> '1'):
        ret = RMath.trimTrailingZeroes(ret);
    }
    if (ret==="-0") {
        if (sign) {
            ret = "+0";
        }
        else {
            ret = "0";
        }
    }
    if (!isNull(decimalSeparator)) {
        // replace . with decimal separator:
        ret = ret.replace(".", decimalSeparator);
    }
    return ret;
}
