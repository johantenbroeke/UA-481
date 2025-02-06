function (camEntity) {
    // collect lead in:
    if (camEntity.getCustomProperty("QCAD", "CamLeadIn", "0")==="1") {
        this.currentLeadInShape = camEntity.castToShape();
        return;
    }
    // collect overcut in:
    if (camEntity.getCustomProperty("QCAD", "CamOvercutIn", "0")==="1") {
        this.currentOvercutInShape = camEntity.castToShape();
        return;
    }
    // collect overcut out:
    if (camEntity.getCustomProperty("QCAD", "CamOvercutOut", "0")==="1") {
        this.currentOvercutOutShape = camEntity.castToShape();
        return;
    }
    // collect lead out:
    if (camEntity.getCustomProperty("QCAD", "CamLeadOut", "0")==="1") {
        this.currentLeadOutShape = camEntity.castToShape();
        return;
    }
//    var cadEntity = this.getEntity();
//    if (isNull(cadEntity)) {
//        return;
//    }
    // collect all connected entities of toolpath into a polyline for offsetting:
    if (camEntity.hasCustomProperty("QCAD", "CamFirstSegment")) {
        this.notifyUser(qsTranslate('CamExporterV2', "Creating new polyline for offsetting at:") + " " +
                        coordinateToString(camEntity.castToShape().getStartPoint()));
        this.currentPolyline = new RPolyline();
        this.currentPolyline.appendShape(camEntity.castToShape());
        this.currentPolylineStart = camEntity.getStartPoint();
    }
    else {
        //qDebug("got mid: ", this.cutterCompensationSide);
        if (!isNull(this.currentPolyline)) {
            //this.notifyUser(qsTranslate('CamExporterV2', "Appending to polyline for offsetting"));
            this.currentPolyline.appendShape(camEntity.castToShape());
            this.notifyUser(qsTranslate('CamExporterV2', "Appending shape to polyline for offsetting at:") + " " +
                            coordinateToString(camEntity.castToShape().getStartPoint()));
        }
    }
}
