function (dialog, di, obj) {
    if (dialog.objectName==="CamProfileToolpathDialog") {
        // disable spindle speed in CamProfileToolpathDialog by default (enabled for Laser post processors):
        var widgetNames = ["CamSpindleSpeed", "CamSpindleSpeed_Label", "CamSpindleSpeed_Unit"];
        for (var i=0; i<widgetNames.length; i++) {
            var wn = widgetNames[i];
            var w = dialog.findChild(wn);
            if (!isNull(w)) {
                w.visible = false;
            }
        }
    }
    if (dialog.objectName==="LayerDialog") {
        // insert custom UI for custom layer properties:
        var className = this.getConfigName(false);
        var customWidget = undefined;
        var l = dialog.layout();
        if (isNull(l)) {
            qWarning("CamExporterV2.prototype.initDialog: layout not found");
        }
        else {
            var uiFile = "postprocessors/" + className + "LayerDialog.ui";
            if (new QFileInfo(uiFile).exists()) {
                customWidget = WidgetFactory.createWidget("", uiFile);
                if (!isNull(customWidget)) {
                    l.insertWidget(2, customWidget);
                    if (!isNull(obj)) {
                        WidgetFactory.restoreState(customWidget, "Cam/" + className, undefined, false, obj);
                    }
                }
            }
        }
    }
}
