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

    this.decimals = 4;
    this.unit = RS.Millimeter;

    this.outputOffsetPath = true;

    this.header = [
        "(postprocessor: UA-481)",
        "[N] G21 G17 G90 G80 G54",
        "",
    ];

    qDebug("<<<<<< ");
    m = getAllMethodNames(Object.getPrototypeOf(this));
    qDebug(m);
    // m.forEach(function(name) {
    //   // Skip the constructor if you don't need it
    //   if (name === 'constructor') return;
    //
    //   var method = UA481.prototype[name];
    //   if (typeof method === 'function') {
    //     qDebug('Method: ' + name);
    //     qDebug(method.toString());
    //     qDebug('------');
    //   }
    // });

    // qDebug(CamExporterV2.prototype.writeFile.toString());
    // qDebug(CamExporterV2.prototype.detectAndWriteToolChange.toString());
    // qDebug(CamExporterV2.prototype.writeToolHeader.toString());
    // qDebug(UA481.prototype.writeBlock.toString());
    qDebug(">>>>>> ");

    // var filePath = "/tmp/test.js"
    // var fileName = new QFileInfo(filePath).fileName(); 
    // var file = new QFile(filePath);
    // var flags = new QIODevice.OpenMode(QIODevice.WriteOnly | QIODevice.Text); 
    // filePath = new QFileInfo(filePath).canonicalFilePath();
    // var stream = new QTextStream(file);
    // stream.setCodec("UTF-8");
    // stream.writeString("poep\n");
    // file.close();

    var filePath = "/tmp/test2.js";
    var fileName = new QFileInfo(filePath).fileName();
    var file = new QFile(filePath);
    var flags = QIODevice.WriteOnly | QIODevice.Text;  // Combine flags directly

    // Open the file for writing
    if (!file.open(flags)) {
        console.error("Failed to open file:", filePath);
    } else {
        var stream = new QTextStream(file);
        stream.setCodec("UTF-8");
        stream.writeString("poep\n");
        stream.flush()
        file.close();
    }



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
