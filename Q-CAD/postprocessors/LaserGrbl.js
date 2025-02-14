/**
 * This file is part of the QCAD/CAM software.
 * Do NOT edit this file. Your changes will be lost when the software 
 * is updated or reinstalled. 
 * For details, please refer to the file README.txt in this directory.
 */
include("LaserBase.js");

/**
 * Base configuration for the LaserGrbl controller. 
 */
function LaserGrbl(documentInterface, camDocumentInterface) {
    LaserBase.call(this, documentInterface, camDocumentInterface);

    this.outputOffsetPath = true;

    // disable line numbers:
    this.empty = "";
    this.registerVariable("empty", "N", true, "", 0);

    this.header = [
        "M5"
    ];
    this.footer = [];


    this.rapidMove = "G0[X][Y]";
    this.linearMove = "G1[X][Y][F]";

    // might be needed for image engraving (variable power):
    //this.linearMove = "G1[X][Y][F][S]";

    // before every contour or pass, switch on laser:
    this.zPassHeader = [
        "M4 [S!]"
    ];
    this.zPassFirstHeader = this.zPassHeader;

    // after every contour or pass, switch off laser:
    this.zPassFooter = [
        "M5"
    ];
    this.zPassLastFooter = this.zPassFooter;

}

LaserGrbl.prototype = new LaserBase();
LaserGrbl.displayName = "";
