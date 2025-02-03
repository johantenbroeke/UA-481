/**
 * This file is part of the QCAD/CAM software.
 * Do NOT edit this file. Your changes will be lost when the software 
 * is updated or reinstalled. 
 * For details, please refer to the file README.txt in this directory.
 */
include("scripts/lib/sprintf2/sprintf2.js");
include("scripts/Cam/CamExportV2/CamExporterV2.js");
include("scripts/Pro/ImportExport/SvgExporter/SvgExporter.js");
include("scripts/Pro/ImportExport/SvgExporter/SvgExporterPG.js");
include("scripts/Pro/Widgets/LayerListPro/LayerListPro.js");

/**
 * Beamo post processor.
 */
function Beamo(cadDocumentInterface, camDocumentInterface) {
    // call constructor of base class 'CamExporterV2':
    CamExporterV2.call(this, cadDocumentInterface, camDocumentInterface);

    if (isNull(cadDocumentInterface)) {
        // constructor used as prototype:
        return;
    }

    this.outputOffsetPath = true;
    this.fileExtensions = [ "beam" ];
}

Beamo.prototype = new CamExporterV2();
Beamo.displayName = "Beamo [mm]";
Beamo.description = "FLUX Beamo CO2 laser cutter/engraver. fluxlasers.com";

var tsCutting = qsTr("Cutting");
var tsEngraving = qsTr("Engraving");
var tsEngravingDiode = qsTr("Engraving (Diode Laser)");

var tsWood = qsTr("Wood");
var tsAcrylic = qsTr("Acrylic");
var tsLeather = qsTr("Leather");
var tsFabric = qsTr("Fabric");
var tsRubber = qsTr("Rubber");
var tsGlass = qsTr("Glass");
var tsMetal = qsTr("Metal");
var tsFoam = qsTr("Foam Rubber");

Beamo.presets = [
    [ tsWood, "3", tsCutting,  [45, 5, 1] ],
    [ tsWood, "5", tsCutting, [55, 4, 2] ],
    [ tsWood, "", tsEngraving, [25, 150, 1] ],
    [ tsAcrylic, "3", tsCutting, [55, 4, 1] ],
    [ tsAcrylic, "5", tsCutting, [55, 5, 2] ],
    [ tsAcrylic, "", tsEngraving, [25, 150, 1] ],
    [ tsLeather, "3", tsCutting, [25, 150, 1] ],
    [ tsLeather, "5", tsCutting, [60, 3, 2] ],
    [ tsLeather, "", tsEngraving, [30, 150, 1] ],
    [ tsFoam, "2", tsCutting, [35, 30, 1] ],
    [ tsFabric, "3", tsCutting, [50, 20, 1] ],
    [ tsFabric, "5", tsCutting, [50, 20, 1] ],
    [ tsFabric, "", tsEngraving, [20, 150, 1] ],
    [ tsRubber, "", tsEngraving, [50, 140, 1] ],
    [ tsGlass, "", tsEngraving, [35, 150, 1] ],
    [ tsMetal, "", tsEngraving, [50, 80, 1] ],
    [ tsMetal, "", tsEngravingDiode, [100, 4, 1] ],
];

Beamo.prototype.writeFile = function(fileName) {
    qDebug("writing Beamo file: ", fileName);

    var properties = new Object();
    properties["decimals"] = 4;
    properties["unit"] = EAction.getIntValue("UnitSettings/Unit", RS.None);
    properties["scale"] = EAction.getStringValue("SvgExport/Scale", "1:1");
    properties["autoOpen"] = EAction.getBoolValue("SvgExport/AutoOpen", false);
    properties["adjustPage"] = RSettings.getBoolValue("SvgExport/AdjustPage", false);
    properties["exportPoints"] = RSettings.getBoolValue("SvgExport/ExportPoints", true);
    properties["circlesOrCrosses"] = RSettings.getStringValue("SvgExport/PointsButtonGroup", "PointsAsCircles");
    properties["circleRadius"] = RSettings.getDoubleValue("SvgExport/CircleRadius", 0.01);
    properties["crossSize"] = RSettings.getDoubleValue("SvgExport/CrossSize", 1);
    properties["qcadLayerAttributes"] = RSettings.getBoolValue("SvgExport/QcadLayerAttributes", false);
    properties["inkscapeTags"] = RSettings.getBoolValue("SvgExport/InkscapeTags", false);
    properties["preserveGeometry"] = RSettings.getBoolValue("SvgExport/PreserveGeometry", false);
    properties["enableMargins"] = RSettings.getBoolValue("SvgExport/EnableMargins", false);
    properties["marginLeft"] = RSettings.getDoubleValue("SvgExport/MarginLeft", 1);
    properties["marginRight"] = RSettings.getDoubleValue("SvgExport/MarginRight", 1);
    properties["marginTop"] = RSettings.getDoubleValue("SvgExport/MarginTop", 1);
    properties["marginBottom"] = RSettings.getDoubleValue("SvgExport/MarginBottom", 1);
    properties["equalMargins"] = RSettings.getBoolValue("SvgExport/EqualMargins", false);
    properties["embedImages"] = RSettings.getBoolValue("SvgExport/EmbedImages", false);
    properties["groupLayers"] = true;
    properties["noEntityComments"] = true;

    var exporter = new BeamoSvgExporter(this.cadDocument, properties, this);
    if (exporter.exportFile(fileName)===false) {
        qDebug("export failed");
    }

    // TODO: Beam Studio cannot open a file given on command line:
//    if (properties["autoOpen"]) {
//        var ret = QDesktopServices.openUrl(QUrl.fromLocalFile(fileName));
//        if (!ret) {
//            QMessageBox.warning(
//                    qsTr("Open failed"),
//                    qsTr("Cannot open default application assigned with\n\"%1\"").arg(fileName)
//            );
//        }
//    }

//    this.entities = [];

//    CamExporterV2.prototype.writeFile.call(this, fileName);

//    var flat = this.getGlobalOptionBool("Cam2D", "1");

//    var doc = new RDocument(new RMemoryStorage(), createSpatialIndex());
//    var di = new RDocumentInterface(doc);

//    var op = new RAddObjectsOperation();
//    for (var i=0; i<this.entities.length; i++) {
//        var e = this.entities[i];
//        e.setDocument(doc);
//        //e.setLayerId(doc.getLayer0Id());
//        //e.setLinetypeId(doc.getLinetypeByLayerId());
//        //e.setLineweight()
//        if (flat) {
//            e.to2D();
//        }
//        op.addObject(e, true, true);
//    }
//    di.applyOperation(op);

//    var filter = this.getGlobalOption("CamDxfOutputFilter", "DXF");
//    if (!di.exportFile(fileName, filter)) {
//        var text = qsTr("File %1 has not been exported.").arg(fileName);
//        var appWin = EAction.getMainWindow();
//        appWin.handleUserWarning(text, true);
//        appWin.setProgressText();
//    }
//    else {
//        if (this.getGlobalOptionBool("CamOpen", "1")===true) {
//            // open output file:
//            openFiles([fileName], false, true);
//        }
//    }

//    var toolpathBlocks = Cam.getToolpathBlocks(doc, true);

//    for (var i=0; i<toolpathBlocks.length; i++) {
//        var ids = doc.queryBlockEntities();
//    }
};


Beamo.prototype.initConfigDialog = function(dialog) {
//    var group = dialog.findChild("GroupCustom");
//    group.title = qsTr("DXF Output");

//    // get QVBoxLayout:
//    var vBoxLayout = group.layout();

//    // add checkboxes:
//    var cbInterpolateSplines = new QCheckBox(qsTr("Interpolate Splines"));
//    cbInterpolateSplines.checked = true;
//    cbInterpolateSplines.objectName = "CamInterpolateSplines";
//    vBoxLayout.addWidget(cbInterpolateSplines, 0,0);

//    var cbInterpolateEllipses = new QCheckBox(qsTr("Interpolate Ellipses"));
//    cbInterpolateEllipses.checked = true;
//    cbInterpolateEllipses.objectName = "CamInterpolateEllipses";
//    vBoxLayout.addWidget(cbInterpolateEllipses, 0,0);

//    cbInterpolateEllipses = new QCheckBox(qsTr("Flatten to 2D (Z=0)"));
//    cbInterpolateEllipses.checked = true;
//    cbInterpolateEllipses.objectName = "Cam2D";
//    vBoxLayout.addWidget(cbInterpolateEllipses, 0,0);

//    var cbOpen = new QCheckBox(qsTr("Open after export"));
//    cbOpen.checked = true;
//    cbOpen.objectName = "CamOpen";
//    vBoxLayout.addWidget(cbOpen, 0,0);

//    // add label and combo box to choose format:
//    var hBoxLayout = new QHBoxLayout(null);
//    vBoxLayout.addLayout(hBoxLayout, 0);

//    var lFormat = new QLabel(qsTr("Format:"));
//    hBoxLayout.addWidget(lFormat, 0,0);

//    var cbFormat = new QComboBox();
//    cbFormat.objectName = "CamDxfOutputFilter";
//    var filterStrings = RFileExporterRegistry.getFilterStrings();
//    filterStrings = translateFilterStrings(filterStrings);
//    for (var i=0; i<filterStrings.length; i++) {
//        if (filterStrings[i].contains("DXF")) {
//            cbFormat.addItem(filterStrings[i]);
//        }
//    }
//    hBoxLayout.addWidget(cbFormat, 0,0);
};

Beamo.prototype.initDialog = function(dialog, di, obj) {
    CamExporterV2.prototype.initDialog.call(this, dialog, di, obj);

    if (dialog.objectName==="LayerDialog") {
        var cbPresets = dialog.findChild("Presets");
        var slPower = dialog.findChild("Power");
        var lePower = dialog.findChild("PowerLineEdit");
        var slSpeed = dialog.findChild("Speed");
        var leSpeed = dialog.findChild("SpeedLineEdit");
        var sbPasses = dialog.findChild("Passes");
        var leSortOrder = dialog.findChild("SortOrder");

        cbPresets.addItem(qsTr("Choose a preset..."));

        for (var i=0; i<Beamo.presets.length; i++) {
            var preset = Beamo.presets[i];
            cbPresets.addItem(this.getPresetItemText(preset), preset[3]);
        }

        cbPresets["currentIndexChanged(int)"].connect(function(idx) {
            var data = cbPresets.itemData(idx);
            if (isNull(data) || data.length!==3) {
                return;
            }
            slPower.value = data[0];
            slSpeed.value = data[1];
            sbPasses.value = data[2];
        });

        if (!isNull(obj)) {
            leSortOrder.setText(obj.getCustomProperty("QCAD", "SortOrder", ""));
        }


//        slPower.valueChanged.connect(function(val) {
//            lePower.setText("%1".arg(val));
//        });
//        lePower.textEdited.connect(function(text) {
//            slPower.blockSignals(true);
//            slPower.setValue(parseInt(text));
//            slPower.blockSignals(false);
//        });
//        //lePower.setText("%1".arg(slPower.value()));

//        slSpeed.valueChanged.connect(function(val) {
//            leSpeed.setText("%1".arg(val));
//        });
//        leSpeed.textEdited.connect(function(text) {
//            slSpeed.blockSignals(true);
//            slSpeed.setValue(parseInt(text));
//            slSpeed.blockSignals(false);
//        });
        //leSpeed.setText("%1".arg(slSpeed.value()));
    }
};

Beamo.prototype.initObject = function(dialog, di, layer) {
    CamExporterV2.prototype.initObject.call(this, dialog, di, layer);

    if (dialog.objectName==="LayerDialog") {
        var leSortOrder = dialog.findChild("SortOrder");

        layer.setCustomProperty("QCAD", "SortOrder", leSortOrder.text);
    }
};

Beamo.prototype.getPresetItemText = function(preset) {
    var ret = preset[0];
    if (preset[1].length>0) {
        ret += " " + preset[1] + "mm";
    }
    ret += " " + preset[2];
    return ret;
}


/**
 * SVG exporter for beamo file format:
 */
function BeamoSvgExporter(document, properties, exporter) {
    SvgExporter.call(this, document, properties);

    this.flipY = true;
    this.baSvg = undefined;
    this.imageSources = {};
    this.imageId = 1;
    this.idCounter = 1;
    this.noCss = true;
    this.noStrokeWidth = true;
    this.embedImages = true;
    this.explicitNoneFill = true;

    this.exporter = exporter;
}

BeamoSvgExporter.prototype = new SvgExporter();

BeamoSvgExporter.prototype.createXmlWriter = function() {
    this.baSvg = new QByteArray();

    var stream = new QXmlStreamWriter(this.baSvg);
    stream.setAutoFormatting(true);
    return stream;
};

BeamoSvgExporter.prototype.exportAdditionalAttributes = function() {
    SvgExporter.prototype.exportAdditionalAttributes.call(this);

    this.writeAttribute("stroke-dasharray", "null");
    this.writeAttribute("stroke-linejoin", "null");
    this.writeAttribute("stroke-linecap", "null");
    this.writeAttribute("vector-effect", "non-scaling-stroke");
};

BeamoSvgExporter.prototype.startExport = function() {
    this.writeStartElement("svg");

    this.writeAttribute("id", "svgcontent");
    this.writeAttribute("width", "3000");
    this.writeAttribute("height", "2100");
    this.writeAttribute("xmlns", "http://www.w3.org/2000/svg");
    this.writeAttribute("xmlns:svg", "http://www.w3.org/2000/svg");
    this.writeAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    this.writeAttribute("data-top", "-243");
    this.writeAttribute("data-left", "-502");
    this.writeAttribute("data-zoom", "0.217");
    this.writeAttribute("data-en_af", "undefined");
    this.writeAttribute("data-en_diode", "undefined");
    this.writeAttribute("data-rotary_mode", "false");
    this.writeAttribute("data-engrave_dpi", "medium");
};

BeamoSvgExporter.prototype.endExport = function() {
    this.writeEndElement("svg");

    // wrap SVG into beam envelop:
    var baContents = this.wrapSvg(this.baSvg, this.imageSources);

    var file = new QFile(this.fileName);
    var flags = new QIODevice.OpenMode(QIODevice.WriteOnly);
    if (file.open(flags)) {
        file.write(baContents);
    }
    file.close();
};

BeamoSvgExporter.prototype.exportImage = function(image, forceSelected) {
    var uri = undefined;
    var fi = new QFileInfo(image.getFileName());
    var suffix = fi.suffix().toLowerCase();
    var format = suffix;
    if (suffix==="jpeg") {
        format = "jpg";
    }
    var unsupportedFormat = (format!=="png" && format!=="jpg");

    if (this.embedImages || unsupportedFormat) {
        var ba = undefined;
        if (unsupportedFormat) {
            ba = new QByteArray();
            var buffer = new QBuffer(ba);
            buffer.open(QIODevice.WriteOnly);
            image.getImage().save(buffer, "PNG"); // writes pixmap into ba in PNG format
            format = "png";
        }
        else {
            // convert image to gray scale:
            var img = new QImage(image.getFileName());

            // create white background:
            var bgWhite = new QImage(img.size(), QImage.Format_ARGB32);
            var p = new QPainter();
            p.begin(bgWhite);
            //p.setCompositionMode(QPainter.CompositionMode_Clear);
            p.fillRect(bgWhite.rect(), new QColor("white"));

            // draw image on top of white background, turing transparent to white:
            p.drawImage(0,0, img);
            p.end();

            //var iw = new QImageWriter("bgWhite.png");
            //iw.write(bgWhite);

            // convert to grayscale, indexed:
            var flags = new Qt.ImageConversionFlags(Qt.AutoColor);
            var grayImg = bgWhite.convertToFormat(QImage.Format_Grayscale8, flags);
            grayImg = grayImg.convertToFormat(QImage.Format_Indexed8, flags);

            // change white to transparent:
            var colorTable = grayImg.colorTable();
            for (var i=0; i<colorTable.length; i++) {
                var c = new QColor(colorTable[i]);
                if (c.red()>250 && c.green()>250 && c.blue()>250) {
                    colorTable[i] = new QColor("#00FFFFFF").rgba();
                }
            }
            grayImg.setColorTable(colorTable);

//            var grayImg = img.convertToFormat(QImage.Format_Grayscale8);

            // change white to transparent:
            // SLOW:
//            for (var u=0; u<img.width(); u++) {
//                qDebug("u:", u);
//                for (var v=0; v<img.height(); v++) {
//                    //qDebug("v:", v);
//                    var c = img.pixelColor(u, v);
//                    if (c.red()===255 && c.green()===255 && c.blue()===255) {
//                        img.setPixelColor(new QColor(255,255,255,0));
//                    }
//                }
//            }

            var tmpDir = new QDir(RSettings.getTempLocation());
            if (!tmpDir.isReadable()) {
                qWarning("cannot write to temp dir:", tmpDir);
                return false;
            }

//            var iw = new QImageWriter(tmpDir.absolutePath() + QDir.separator + "beamo_gray.png");
//            iw.write(grayImg);
//            var iw = new QImageWriter(tmpDir.absolutePath() + QDir.separator + "beamo_mask.png");
//            iw.write(mask);

            var tmpFile = tmpDir.absolutePath() + QDir.separator + "beamo_tmp." + new QFileInfo(image.getFileName()).suffix();
            qDebug("tmpFile:", tmpFile);
            var iw = new QImageWriter(tmpFile);
            if (!iw.write(grayImg)) {
                qWarning("cannot write to temp file:", tmpFile);
                qWarning("error:", iw.errorString());
                iw.destroy();
                return false;
            }
            iw.destroy();

            //var file = new QFile(image.getFileName());
            var file = new QFile(tmpFile);
            var flags = new QIODevice.OpenMode(QIODevice.ReadOnly);
            if (file.open(flags)) {
                ba = file.readAll();
                file.close();
            }
            if (!file.remove()) {
                qWarning("cannot remove temp file:", tmpFile);
            }
        }

        if (!isNull(ba)) {
            if (format==="png") {
                uri = "data:image/png;base64,";
            }
            else if (format==="jpg") {
                uri = "data:image/jpg;base64,";
            }
            if (!isNull(uri)) {
                uri += ba.toBase64();
            }
        }
    }

    // if we don't embed images or the file is not found or cannot be opened,
    // link to image file:
//    if (isNull(uri)) {
//        var svgDir = new QDir(this.fileName);
//        uri = svgDir.relativeFilePath(image.getFileName());
//        if (uri.startsWith("..")) {
//            // don't use relative path if image above svg file in hierarchy:
//            uri = image.getFileName();
//        }
//    }

    var ip = image.getInsertionPoint();
    //ip.y+=image.getHeight();
    ip = this.convert(ip);
    var x = ip.x;
    var y = ip.y;

//    var scale = new RVector();
//    scale.x = image.getUVector().getMagnitude();
//    scale.y = image.getVVector().getMagnitude();
//    if (RMath.getAngleDifference180(image.getUVector().getAngle(), image.getVVector().getAngle()) < 0.0) {
//        scale.y *= -1;
//    }
    var angle = image.getUVector().getAngle();

//    qDebug("img:", image.getFileName());
//    qDebug("uv:", image.getUVector());
//    qDebug("vv:", image.getVVector());

    this.exportTransformGroupBegin();

    //this.writeStartElement("g");

    this.writeStartElement("image");
    // TODO: opacity
    this.writeAttribute("transform",
        " translate(%1,%2)".arg(x).arg(y)
      + " rotate(%1)".arg(RMath.rad2deg(-angle))
      //+ " scale(%1,%2)".arg(scale.x).arg(-scale.y)
      + " translate(0,%1)".arg(-image.getHeight()*10)
    );
    this.writeAttribute("x", 0);
    this.writeAttribute("y", 0);
    this.writeAttribute("width", this.convert(image.getWidth()));
    this.writeAttribute("height", this.convert(image.getHeight()));
    //this.writeAttribute("opacity", (100-image.getFade())/100.0);

    //this.writeStartElement("image");
    this.writeAttribute("xlink:href", uri);
    //this.writeImageAttributes();
    //this.writeAttribute("x", x);
    //this.writeAttribute("y", y);

    this.writeAttribute("id", "svg_" + this.imageId);
    this.writeAttribute("data-threshold", "254");
    this.writeAttribute("data-shading", "true");
    this.writeAttribute("data-ratiofixed", "true");

    this.writeEndElement("image");

    //this.writeEndElement("g");

    this.exportTransformGroupEnd();

    qDebug("exporting image:", image.getFileName());

    // store image sources in array:
    var f = new QFile(image.getFileName());
    //var flags = new QIODevice.OpenMode(QIODevice.ReadOnly);
    if (!f.open(QIODevice.ReadOnly)) {
        return;
    }
    var imgBuffer = f.readAll();
    f.close();

    this.imageSources["svg_" + this.imageId] = imgBuffer;

    this.imageId++;
};

//BeamoSvgExporter.prototype.writeImageAttributes = function() {
//    this.writeAttribute("id", "svg_" + this.imageId);
//    this.writeAttribute("data-threshold", "254");
//    this.writeAttribute("data-shading", "true");
//    this.writeAttribute("data-ratiofixed", "true");
//};

BeamoSvgExporter.prototype.exportEntities = function(allBlocks) {
    qDebug("exportEntities");
    var doc = this.getDocument();

    var templateLayerName = "CAM" + RLayer.getHierarchySeparator() + "Beamo" + RLayer.getHierarchySeparator() + "template";

    // TODO: make adjustable:
    var tableBB = new RBox(0,0,300,210);

    // order entities by layer, export layer by layer:
    var layerIds = doc.queryAllLayers();
    layerIds = doc.sortLayers(layerIds);
    for (var i = layerIds.length-1; i >= 0 ; --i) {
        var layerId = layerIds[i];
        var layer = doc.queryLayer(layerId);
        if (layer.isNull()) {
            continue;
        }
        var layerName = layer.getName();

        if (layerName===templateLayerName) {
            // ignore template layer:
            continue;
        }

        var entityIds = doc.queryLayerEntities(layerId);
        if (entityIds.length===0) {
            // layer is empty:
            continue;
        }

        var gotVisibleEntity = false;
        var c, e, entityId;
        for (c = 0; c < entityIds.length; ++c) {
            entityId = entityIds[c];
            e = doc.queryEntity(entityId);
            if (this.isVisible(e.data())) {
                gotVisibleEntity = true;
                break;
            }
        }

        if (!gotVisibleEntity) {
            continue;
        }

        qDebug("exporting layer: ", layer.getName());

        var power = layer.getCustomProperty("QCAD", this.exporter.getCustomPropertyPrefix() + "Power", 15);
        var speed = layer.getCustomProperty("QCAD", this.exporter.getCustomPropertyPrefix() + "Speed", 20);
        var passes = layer.getCustomProperty("QCAD", this.exporter.getCustomPropertyPrefix() + "Passes", 1);

        this.writeStartElement("g");
        this.writeAttribute("class", "layer");
        //this.writeAttribute("data-color", this.getColorName(layer.getColor()));
        this.writeAttribute("data-color", layer.getColor().name());
        this.writeAttribute("clip-path", "url(#scene_mask)");
        this.writeAttribute("data-speed", speed);
        this.writeAttribute("data-strength", power);
        this.writeAttribute("data-repeat", passes);
        this.writeAttribute("data-height", "-3");
        this.writeAttribute("data-diode", "0");
        this.writeAttribute("data-zstep", "0");

        this.writeStartElement("title");
        this.writeCharacters(layer.getName());
        this.writeEndElement("title");

        this.writeStartElement("filter");
        this.writeAttribute("color-interpolation-filters", "linearRGB");
        this.writeAttribute("primitiveUnits", "userSpaceOnUse");
        this.writeAttribute("filterUnits", "objectBoundingBox");
        this.writeAttribute("id", "filter#000");
        this.writeStartElement("feColorMatrix");
        this.writeAttribute("values", "1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 1 0");
        this.writeAttribute("type", "matrix");
        this.writeEndElement("feColorMatrix");
        this.writeEndElement("filter");

        entityIds = doc.getStorage().orderBackToFront(entityIds);

        for (c = 0; c < entityIds.length; ++c) {
            entityId = entityIds[c];

            e = doc.queryEntity(entityId);

            var bb = e.getBoundingBox();
            if (!tableBB.intersects(bb)) {
                continue;
            }

            this.exportEntity(e.data(), false);
        }

        this.writeEndElement("g");
    }
};

//BeamoSvgExporter.prototype.exportCurrentEntity = function(preview, forceSelected) {
//    // start layer:

//    SvgExporter.prototype.exportCurrentEntity.call(this, preview, forceSelected);


//}

BeamoSvgExporter.prototype.exportLineSegment = function(line, angle) {
    var p1 = line.getStartPoint();
    var p2 = line.getEndPoint();
    p1 = this.convert(p1);
    p2 = this.convert(p2);

    this.writeStartElement("line");
    this.writeAttribute("vector-effect", "non-scaling-stroke");
    this.writeAttribute("fill", "none");
    this.writeAttribute("stroke-linecap", "null");
    this.writeAttribute("stroke-linejoin", "null");
    this.writeAttribute("stroke-dasharray", "null");
    //this.writeAttribute("stroke", this.getColorName(this.getPen().color()));
    this.writeAttribute("stroke", this.getPen().color().name());
    this.writeAttribute("id", "svg_" + this.idCounter++);
    this.writeAttribute("y2", this.format(p2.y));
    this.writeAttribute("x2", this.format(p2.x));
    this.writeAttribute("y1", this.format(p1.y));
    this.writeAttribute("x1", this.format(p1.x));
    this.writeEndElement("line");
};

//BeamoSvgExporter.prototype.getColorName = function(c) {
//    var r = c.red() / 17;
//    var g = c.green() / 17;
//    var b = c.blue() / 17;

//    return "#" + r.toString(16) + g.toString(16) + b.toString(16);
//};

BeamoSvgExporter.prototype.convert = function(v) {
    var ret = SvgExporter.prototype.convert.call(this, v);
    if (isVector(ret)) {
        ret.x *= 10;
        ret.y *= 10;
        ret.y+=2100;
    }
    else {
        ret *= 10;
    }

    return ret;
};

BeamoSvgExporter.prototype.wrapSvg = function(baSvg, imageSources) {
    var baSignature = new QByteArray("Beam");
    baSignature.appendByte(2);    // 0x2 (version ?)

    var baSvgBlock = this.getSvgByteArray(baSvg);
    var baImageSourcesBlock = this.getImageSourceByteArray(imageSources);
    var baMetaDataBlock = new QByteArray("Hi, I am meta data O_<");

    var baHeader = new QByteArray();
    baHeader.append(this.getVariableIntByteArray(baMetaDataBlock.length()));
    baHeader.append(baMetaDataBlock);
    baHeader.append(this.getVariableIntByteArray(baSvgBlock.length()));
    baHeader.append(this.getVariableIntByteArray(baImageSourcesBlock.length()));
    var baHeaderSize = this.getVariableIntByteArray(baHeader.length());

    // null termination:
    var baNull = new QByteArray();
    baNull.appendByte(0);

    // concatenate all together:
    var ret = new QByteArray();
    ret.append(baSignature);
    ret.append(baHeaderSize);
    ret.append(baHeader);
    ret.append(baSvgBlock);
    ret.append(baImageSourcesBlock);
    ret.append(baNull);
    return ret;
};

/**
 * Pack int value into byte array of variable length.
 * If the first bit is one, the value continues, otherwise it's the last part of the value.
 */
BeamoSvgExporter.prototype.getVariableIntByteArray = function(value) {
    var a = new QByteArray();
    while (value > 127) {
        var b = value % 128 + 128;
        a.appendByte(b);
        value = Math.floor(value / 128);
    }
    a.appendByte(value);
    return a;
};

BeamoSvgExporter.prototype.getSvgByteArray = function(svgBa) {
    // header for SVG buffer is 0x01:
    var baType = new QByteArray();
    baType.appendByte(0x01);

    var baLength = this.getVariableIntByteArray(svgBa.length());

    var baRet = new QByteArray();
    baRet.append(baType);
    baRet.append(baLength);
    baRet.append(svgBa);
    return baRet;
};

BeamoSvgExporter.prototype.getImageSourceByteArray = function(imageSources) {
    // header for image sources part is 0x02:
    var baType = new QByteArray();
    baType.appendByte(0x02);

    var baTemp = new QByteArray();
    for (var id in imageSources) {
        qDebug("write image: id:", id);
        //qDebug("write image: data:", imageSources[id]);

//        var idSizeBuf = new Buffer.alloc(1);
//        var idBuf = new Buffer.from(id);
        var baId = new QByteArray(id);

        var baIdLength = new QByteArray();
        baIdLength.appendByte(baId.length());

        //var imageBuf = Buffer.from(imageSources[id]);
        var baImageSize = this.getVariableIntByteArray(imageSources[id].length());
        //tempbuffer = Buffer.concat([tempbuffer, idSizeBuf, idBuf, imageSizeBuf, imageBuf]);
        baTemp.append(baIdLength);
        baTemp.append(baId);
        baTemp.append(baImageSize);
        baTemp.append(imageSources[id]);
    }

    var baRet = new QByteArray();
    baRet.append(baType);
    baRet.append(this.getVariableIntByteArray(baTemp.length()));
    baRet.append(baTemp);
    //qDebug("imageSourceBlockBuffer:");
    //this.dump(imageSourceBlockBuffer);
    return baRet;
};

BeamoSvgExporter.prototype.exportEllipse = function(ellipse, offset) {
    SvgExporterPG.prototype.exportEllipse.call(this, ellipse, offset);
}

BeamoSvgExporter.prototype.dump = function(byteArray) {
    var out = "";
    for (var i=0; i<byteArray.length(); i++) {
        var b = byteArray.at(i);
        if (b<0) {
            b=-b;
            b+=128;
        }

        //if (b>=32 && b<=127) {
        var s = String.fromCharCode(b);
        //if (/[\x00-\x1F\x0E-\x1F]/.test(s)) {
            out += "<" + sprintf("%02x", b) +  ">";
        //}
        //else {
        //    out += s;
        //}

        //qDebug(b);
        //qDebug(out);
    }
    qDebug(out);
};
