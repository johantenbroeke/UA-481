/**
 * This file is part of the QCAD/CAM software.
 * Do NOT edit this file. Your changes will be lost when the software 
 * is updated or reinstalled. 
 * For details, please refer to the file README.txt in this directory.
 */

// Include definition of class GCodeBase:
include("GCodeBase.js");

// Constructor:
function GCodeMM(cadDocumentInterface, camDocumentInterface) {
    GCodeBase.call(this, cadDocumentInterface, camDocumentInterface);

    this.decimals = 4;
    this.unit = RS.Millimeter;
}

// Configuration is derived from GCodeBase:
GCodeMM.prototype = new GCodeBase();

// Display name shown in user interface:
GCodeMM.displayName = "G-Code (G41/G42) [mm]";
GCodeMM.description = "Generic G-Code with G41/G42 for tool radius compensation";
