function (contours, siEntryPoints) {
    // force manual order:
    //   not used if contours are exported as individual toolpaths
    //   (this.oneToolpathPerContour===true)
    if (this.currentToolpathBlock.getCustomProperty("QCAD", "CamManualOrder")==="1") {
        contours.sort(function(a,b) {
            return a.manualOrder-b.manualOrder;
        });
        // manual order by drawing order:
        for (var i=0; i<contours.length; i++) {
            this.exportContour(contours, i, 0);
        }
    }
    else {
        // auto order by distance:
        do {
            // find next entry point:
            var ssid = siEntryPoints.queryNearestNeighbor(this.cursor.x, this.cursor.y, 0.0);
            // index of contour in this.contours:
            var contourIndex = ssid[0];
            // position of entity in contour (0,1,...):
            var shapeIndex = ssid[1];
            // no contour found: spatial index is emtpy: we're done
            if (contourIndex===-1 || shapeIndex===-1) {
                break;
            }
            this.notifyUser(qsTranslate('CamExporterV2', "Processing contour %1").arg(contourIndex));
            this.incIndent();
            //this.pushContext([ "CamContourIndex", contourIndex.toString() ]);
            this.exportContour(contours, contourIndex, shapeIndex, siEntryPoints);
            //this.popContext([ "CamContourIndex", contourIndex.toString() ]);
            this.decIndent();
        } while (true);
    }
}
