function (dialog) {
    // add options for laser on / off:
    var group = dialog.findChild("GroupCustom");
    group.title = qsTranslate('GCodeBase', "G-Code");
    // get QVBoxLayout:
    var vBoxLayout = group.layout();
    // add checkbox to force G1:
    var hBoxLayout = new QHBoxLayout(null);
    vBoxLayout.addLayout(hBoxLayout, 0);
    var cbAlwaysWriteG1 = new QCheckBox(qsTranslate('GCodeBase', "Always write G1"));
    cbAlwaysWriteG1.objectName = "AlwaysWriteG1";
    hBoxLayout.addWidget(cbAlwaysWriteG1, 0,0);
}
