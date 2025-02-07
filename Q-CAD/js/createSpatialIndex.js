function (contours) {
    // TODO: RSpatialIndexPro has no data visitor:
    //var siEntryPoints = createSpatialIndex();
    var siEntryPoints = new RSpatialIndexNavel();
    // iterate through contours and add potential entry points to
    // spatial index:
    for (var i=0; i<contours.length; i++) {
        var contour = contours[i];
        var found = false;
        var entryPoints = contour.computeEntryPoints();
        for (var k=0; k<entryPoints.length; k++) {
            var p = entryPoints[k];
            // some entities in the contour might not have any possible entry points:
            if (isValidVector(p)) {
                siEntryPoints.addToIndex(i, k, new RBox(p, 0.0));
                found = true;
            }
        }
        if (!found) {
            this.warnUser(qsTranslate('CamExporterV2', "No entry points found for contour %1").arg(i));
        }
        else {
            this.notifyUser(qsTranslate('CamExporterV2', "Adding entry points for contour %1:").arg(i));
            this.incIndent();
            for (var c=0; c<entryPoints.length && c<10; c++) {
                if (entryPoints[c].isValid()) {
                    this.notifyUser(coordinateToString(entryPoints[c]));
                }
            }
            if (entryPoints.length>10) {
                this.notifyUser("...");
            }
            this.decIndent();
        }
    }
    return siEntryPoints;
}
