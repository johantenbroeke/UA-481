include("GCodeBase.js");

/**
 * Configuration for UA-481 with syntec 60CB controllers.
 * Output of offsets in Millimeters.
 */
function UA481(documentInterface, camDocumentInterface) {
    GCodeBase.call(this, documentInterface, camDocumentInterface);

    this.decimals = 4;
    this.unit = RS.Millimeter;

    this.outputOffsetPath = true;

    this.header = [
        "(postprocessor: UA-481)",
        "[N] G21 G17 G90 G80 G54",
        "",
    ];

    this.toolpathHeader = [
		"",
		"(Begin Tool Path [TOOLPATH_INDEX]: [TOOLPATH_NAME])"
    ];

    this.toolHeader = [
        "",
        "(tool change)",
        "[N] [T] M06",
        "[N] G54",
        "[N] G43 [ZS!] H[T#] Z100.000",
        "[N] [S] M03",
        "[N] G94",
        "(end tool change)",
        "",
    ];

}

 UA481.prototype = new GCodeBase();
 UA481.displayName = "UA-481";
