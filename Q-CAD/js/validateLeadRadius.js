function (msgs, leadSize, toolDiameter, leadIn) {
    var valid = true;
    if (leadSize<=toolDiameter+0.0001) {
        if (leadIn) {
            msgs.push(qsTranslate('CamExporterV2', "Lead in radius must be larger than tool diameter."));
        }
        else {
            msgs.push(qsTranslate('CamExporterV2', "Lead out radius must be larger than tool diameter."));
        }
        valid = false;
    }
    return valid;
}
