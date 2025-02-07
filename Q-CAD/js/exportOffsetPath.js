function () {
    if (isNull(this.currentPolyline) /*|| isNull(this.currentSide)*/ ||
        isNull(this.currentPolylineStart)) {
        return;
    }
    if (this.getSide()===Cam.Side.None) {
        // no side: on contour:
        return;
    }
    var toolDiameter = this.getToolDiameter(true);
    var dir = this.getDirection();
    var side = (dir===Cam.Direction.ClimbLeft ? RS.LeftHand : RS.RightHand);
    var pl = this.currentPolyline.clone();
    pl.to2D();
    var gotLeadIn = !isNull(this.offsetLeadInShapes) && this.offsetLeadInShapes.length!==0;
    var gotLeadOut = !isNull(this.offsetLeadOutShapes) && this.offsetLeadOutShapes.length!==0;
    // compute offset:
    this.notifyUser(qsTranslate('CamExporterV2', "Creating offset polyline(s)..."));
    var worker = new RPolygonOffset(toolDiameter/2, 1, RVector.invalid, this.offsetJoin, false);
    if (gotLeadIn || gotLeadOut) {
        // with leads, we don't need an arc around the first corner
        // without leads, we do
        worker.setForceOpen(true);
    }
    worker.setForceSide(side);
    worker.addPolyline(pl);
    //worker.setDisableClipping(true);
    var offsetPolylines = worker.getOffsetShapes();
    if (offsetPolylines.length>=1) {
        var offsetPolyline = offsetPolylines[0];
        if (offsetPolyline.isClosed()) {
            offsetPolyline.convertToOpen();
        }
        if (offsetPolyline.countSegments()>0) {
            // explode offset polyline and add segments to output:
            var segments = offsetPolyline.getExploded();
            var sp, ep;
            // prepend offset lead in:
            if (gotLeadIn) {
                // trim start of offset contour to end of offset lead in:
                if (this.offsetLeadInShapes.length>0 && segments.length>0) {
                    var lastLeadInShape = this.offsetLeadInShapes[this.offsetLeadInShapes.length-1];
                    ep = lastLeadInShape.getEndPoint();
                    var firstContourShape = segments[0];
                    sp = firstContourShape.getStartPoint();
                    if (!ep.equalsFuzzy(sp)) {
                        firstContourShape.trimStartPoint(ep);
                    }
                }
                segments = this.offsetLeadInShapes.concat(segments);
            }
            // append offset lead out:
            if (gotLeadOut) {
                // trim end of offset contour to start of offset lead out:
                if (this.offsetLeadOutShapes.length>0 && segments.length>0) {
                    var firstLeadOutShape = this.offsetLeadOutShapes[0];
                    sp = firstLeadOutShape.getStartPoint();
                    var lastContourShape = segments[segments.length-1];
                    ep = lastContourShape.getEndPoint();
                    if (!sp.equalsFuzzy(ep)) {
                        lastContourShape.trimEndPoint(sp);
                    }
                }
                segments = segments.concat(this.offsetLeadOutShapes);
            }
            for (var k=0; k<segments.length; k++) {
                var segment = segments[k];
                if (isFunction(segment.data)) {
                    segment = segment.data();
                }
                var ctx = undefined;
                if (k<this.offsetLeadInShapes.length) {
                    if (k===this.offsetLeadInShapes.length-1 && this.hasOvercut()) {
                        ctx = "CamOvercutIn";
                    }
                    else {
                        ctx = "CamLeadIn";
                    }
                }
                else if (k>=segments.length-this.offsetLeadOutShapes.length) {
                    if (k===segments.length-this.offsetLeadOutShapes.length && this.hasOvercut()) {
                        ctx = "CamOvercutOut";
                    }
                    else {
                        ctx = "CamLeadOut";
                    }
                }
                if (!isNull(ctx)) {
                    this.pushContext(ctx);
                }
                this.exportShape(segment);
                if (!isNull(ctx)) {
                    this.popContext(ctx);
                }
            }
        }
    }
    else {
        this.warnUser(qsTranslate('CamExporterV2', "No valid offset for polyline at:") + " " +
                      coordinateToString(this.currentPolyline.getStartPoint()));
    }
    this.currentPolyline = undefined;
}
