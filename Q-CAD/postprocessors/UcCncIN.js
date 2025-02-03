/**
 * This file is part of the QCAD/CAM software.
 * Do NOT edit this file. Your changes will be lost when the software 
 * is updated or reinstalled. 
 * For details, please refer to the file README.txt in this directory.
 */
include("UcCnc.js");

/**
 * Configuration for UCCNC controllers.
 * Output in Inches.
 */
function UcCncIN(documentInterface, camDocumentInterface) {
    UcCnc.call(this, documentInterface, camDocumentInterface);

    // G20: Inch unit
    // G17: XY Plane select
    // G90: Absolute distance mode
    // G40: Cancel cutter radius compensation
    // G49: Cancel tool length offset
    // G80: Cancel motion mode
    // G70: Inch unit
    // G91.1: Incremental distance mode for I/J
    this.header = [
        "(UCCNC)",
        "[N] G00 G20 G17 G90 G40 G49 G80",
        "[N] G70 G91.1",
    ];
}

UcCncIN.prototype = new UcCnc();
UcCncIN.displayName = "UCCNC (Offset) [in]";
