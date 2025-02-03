/**
 * This file is part of the QCAD/CAM software.
 * Do NOT edit this file. Your changes will be lost when the software 
 * is updated or reinstalled. 
 * For details, please refer to the file README.txt in this directory.
 */
include("GCodeBase.js");

/**
 * Base configuration for grbl controllers. 
 */
function Grbl(documentInterface, camDocumentInterface) {
    GCodeBase.call(this, documentInterface, camDocumentInterface);

    this.toolHeader = [
        "[N] [T]",
        "[N] [S] M03"
    ];
}

Grbl.prototype = new GCodeBase();
Grbl.displayName = "";
