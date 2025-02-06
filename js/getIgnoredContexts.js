function () {
    var ret = [];
    var ignoredContext = {
        "CamZMove" : [ "CamCompensationOn", "CamLeadIn", "CamLeadOut" ],
        "CamRapidMove" : [ "CamCompensationOn", "CamLeadIn", "CamLeadOut", "CamCuttingContour" ]
    };
    for (var k in ignoredContext) {
        if (this.checkContext(k)) {
            ret = ret.concat(ignoredContext[k]);
        }
    }
    // z move means not cutting contour, except when cutting tabs:
    if (this.checkContext("CamZMove") && !this.checkContext("CamTab")) {
        ret.push("CamCuttingContour");
    }
    ret = ret.concat(this.ignoredContexts);
    return ret;
}
