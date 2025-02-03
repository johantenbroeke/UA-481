/**
 * This file is part of the QCAD/CAM software.
 * Do NOT edit this file. Your changes will be lost when the software 
 * is updated or reinstalled. 
 * For details, please refer to the file README.txt in this directory.
 */
include("GCodeLaserOffset.js");

/**
 * Switch laser on / off, disable tool changes.
 */
function GCodeLaserOffsetMM(documentInterface, camDocumentInterface) {
    GCodeLaserOffset.call(this, documentInterface, camDocumentInterface);

    this.decimals = 4;
    this.unit = RS.Millimeter;
}

GCodeLaserOffsetMM.prototype = new GCodeLaserOffset();
GCodeLaserOffsetMM.displayName = "G-Code Laser (Offset) [mm]";
