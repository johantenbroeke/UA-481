/**
 * This file is part of the QCAD/CAM software.
 * Do NOT edit this file. Your changes will be lost when the software 
 * is updated or reinstalled. 
 * For details, please refer to the file README.txt in this directory.
 */
include("GCodeBase.js");

/**
 * Base configuration for EMC2 controllers.
 */
function Emc2(cadDocumentInterface, camDocumentInterface) {
    GCodeBase.call(this, cadDocumentInterface, camDocumentInterface);

    this.decimals = 4;
    this.fileExtensions = [ "ngc" ];

    // M5: Stop spindle
    // M2: Program end 
    this.footer = [
        "M5",
        "M2",
        "%"
    ];

    // M6: Tool change
    // M3: Spindle clockwise 
    this.toolHeader = [
        "M6 [T]",
        "M3 [S]"
    ];

    this.rapidMove =                 "G0 [X] [Y]";
    this.rapidMoveZ =                "G0 [Z]";

    this.firstLinearMove =           "G1 [X] [Y] [F]";
    this.firstLinearMoveZ =          "G1 [Z] [F]";
    this.linearMove =                "[X] [Y] [F]";
    this.linearMoveZ =               "[Z] [F]";

    this.firstArcCWMove =            "G2 [X] [Y] [I] [J] [F]";
    this.arcCWMove =                 "G2 [X] [Y] [I] [J] [F]";

    this.firstArcCCWMove =           "G3 [X] [Y] [I] [J] [F]";
    this.arcCCWMove =                "G3 [X] [Y] [I] [J] [F]";

    this.linearMoveCompensationLeft = [
        "[F!]",
        "G41 [X] [Y]"
    ];
    this.linearMoveCompensationRight = [
        "[F!]",
        "G42 [X] [Y]"
    ];
    this.linearMoveCompensationOff = [
        "G40",
        "G1 [X] [Y]"
    ];
}

Emc2.prototype = new GCodeBase();
Emc2.displayName = "";
