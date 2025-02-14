/**
 * This file is part of the QCAD/CAM software.
 * Do NOT edit this file. Your changes will be lost when the software 
 * is updated or reinstalled. 
 * For details, please refer to the file README.txt in this directory.
 */
include("Mach3MM.js");

function Mach3LaserMM(cadDocumentInterface, camDocumentInterface) {
    Mach3MM.call(this, cadDocumentInterface, camDocumentInterface);

    this.fileExtensions = [ "nc" ];

    this.decimals = 4;
    this.unit = RS.Millimeter;

    // disable all Z moves:
    this.firstLinearMoveZ = [];
    this.linearMoveZ = [];
    this.rapidMoveZ = [];

    // stop cutting at tab:
    this.stopAtTab = true;

    this.toolHeader = [];

    // before every contour or pass, switch on laser:
    this.zPassHeader = [
        "[N] S255 M03"
    ];
    this.zPassFirstHeader = this.zPassHeader;

    // after every contour or pass, switch off laser:
    this.zPassFooter = [
        "[N] S0"
    ];
    this.zPassLastFooter = this.zPassFooter;
}

Mach3LaserMM.prototype = new Mach3MM();

Mach3LaserMM.displayName = "Mach3 Laser (G41/G42) [mm]";

