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
    this.toolChangeMode = CamExporterV2.FirstMoveMode.BeforeFirstXYMove;

    this.outputOffsetPath = true;

    this.header = [
        "(postprocessor: UA-481)",
        "[N] G21 G17 G90 G80 G54",
        "",
    ];

    // Use introspection to get the js API
    // Not perfect but it beats being totally in the dark
    if this.getCamExporterV2API: // look in syslog
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

    this.toolpathHeader = [
      "",
      "(Begin Tool Path [TOOLPATH_INDEX]: [TOOLPATH_NAME])"
    ];

    this.toolHeader = [
        "",
        "([X] [Y] [Z])",
        "(tool change [ZS!])",
        "[N] [T] M06",
        "[N] G54",
        //"[N] G43 [ZS] H[T#] Z100.000",
        "[N] G43 [ZS] H[T#] [ZS!]",
        "[N] [S] M03",
        "[N] G94",
        "(end tool change)",
        "",
    ];

}

 UA481.prototype = new GCodeBase();
 UA481.displayName = "UA-481";
