include("GCodeBase.js");

/**
 * Configuration for UA-481 with syntec 60CB controllers.
 * Output of offsets in Millimeters.
 */

function getAllMethodNames(obj) {
  var methods = {};
  while (obj !== null) {
    var propNames = Object.getOwnPropertyNames(obj);
    for (var i = 0; i < propNames.length; i++) {
      var prop = propNames[i];
      if (typeof obj[prop] === 'function') {
        methods[prop] = true;
      }
    }
    obj = Object.getPrototypeOf(obj);
  }
  return Object.keys(methods);
}


function UA481(documentInterface, camDocumentInterface) {
    GCodeBase.call(this, documentInterface, camDocumentInterface);

    this.getCamExporterV2API = false;
    this.decimals = 4;
    this.unit = RS.Millimeter;
    this.options = { trailingZeroes:true };
    this.toolChangeMode = CamExporterV2.FirstMoveMode.BeforeFirstZMove;
    this.alwaysWriteG1 = true;
    this.outputOffsetPath = true;
    this.zClearance = 50.0;
    this.zCuttingDepth = -0.5;

    this.header = [
        "(postprocessor: UA-481)",
        "[N] G21 G17 G90 G80 G54",
    ];

    // Use introspection to get the js API
    // Not perfect but it beats being totally in the dark
    if (this.getCamExporterV2API){ // look in syslog
      qDebug("<<<<<< ");
      m = getAllMethodNames(Object.getPrototypeOf(this));
      m.forEach(function(name) {
        // Skip the constructor if you don't need it
        if (name === 'constructor') return;

        var method = UA481.prototype[name];
        if (typeof method === 'function') {
          qDebug('*BEGIN*');
          qDebug('Method: ' + name);
          qDebug(method.toString());
          qDebug('*END*');
        }
      });
      qDebug(">>>>>> ");
    }

    this.toolpathHeader = [
      "",
      "(Begin Tool Path [TOOLPATH_INDEX]: [TOOLPATH_NAME])"
    ];

    this.toolHeader = [
        "",
        "(tool change)",
        "[N] [T] M06",
        "[N] G54",
        "[N] G43 [ZS] H[T#] Z50.0000",
        "[N] [S] M03",
        "[N] G94",
        "(end tool change)",
        "",
    ];

}

UA481.prototype = new GCodeBase();
UA481.displayName = "UA-481";
UA481.prototype.postInitDialog = function(obj, dialog, di, obj) {
    if (dialog.objectName==="CamProfileToolpathDialog") {
        // change default cutting depth:
        var leCuttingDepth = dialog.findChild("CamZCuttingDepth");
        leCuttingDepth.setValue(0.5);

        // change default cutting depth:
        var safez = dialog.findChild("CamZClearance");
        safez.setValue(50);

        // change default side:
        var cbSide = dialog.findChild("CamSide");
        cbSide.currentIndex = 0; // 0: none, 1: outside, 2: inside

        // change default direction:
        var cbDirection = dialog.findChild("CamDirection");
        cbDirection.currentIndex = 0; // 0: Left, 1: Right
    }
};
