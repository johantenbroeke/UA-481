/**
 * This file is part of the QCAD/CAM software.
 * Do NOT edit this file. Your changes will be lost when the software 
 * is updated or reinstalled. 
 * For details, please refer to the file README.txt in this directory.
 */
include("LaserBase.js");

/**
 * Base configuration for the ADT HC4500 controller. 
 */
function AdtHc4500(documentInterface, camDocumentInterface) {
    LaserBase.call(this, documentInterface, camDocumentInterface);

    this.outputOffsetPath = true;

    // disable line numbers:
    this.empty = "";
    this.registerVariable("empty", "N", true, "", 0);

    this.footer = [
        "M30",
    ];

    this.rapidMove = "G0[X][Y]";
    this.firstRapidMove = this.rapidMove;
    this.linearMove = "G1[X][Y][F]";
    this.firstLinearMove = this.linearMove;

    this.arcCWMove = "G2[X][Y][IA][JA][F]";
    this.firstArcCWMove = this.arcCWMove;

    this.arcCCWMove = "G3[X][Y][IA][JA][F]";
    this.firstArcCCWMove = this.arcCCWMove;

    // before every contour or pass, switch on laser:
    this.zPassHeader = [
        "M20",
        "M14",
        "M04",
        "M06",
    ];
    this.zPassFirstHeader = this.zPassHeader;

    // after every contour or pass, switch off laser:
    this.zPassFooter = [
        "M21",
        "M15",
    ];
    this.zPassLastFooter = this.zPassFooter;

}

AdtHc4500.prototype = new LaserBase();
AdtHc4500.displayName = "";
