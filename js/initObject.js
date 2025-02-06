function (dialog, di, obj) {
    if (dialog.objectName==="LayerDialog") {
        var className = this.getConfigName();
        var uiFile = "postprocessors/" + className + "LayerDialog.ui";
        if (new QFileInfo(uiFile).exists()) {
            var customWidget = WidgetFactory.createWidget("", uiFile);
            if (!isNull(customWidget)) {
                var objName = customWidget.objectName;
                customWidget.destroy();
                customWidget = dialog.findChild(objName);
                if (!isNull(customWidget)) {
                    WidgetFactory.saveState(customWidget, "Cam/" + className, obj);
                }
            }
        }
    }
}
