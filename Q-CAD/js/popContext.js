function (context) {
    var prevContext = this.context.pop();
    if (isArray(prevContext) && isArray(context)) {
        if (!prevContext.isEqual(context)) {
            qDebug("pop: got: ", context);
            qDebug("pop: expected: ", prevContext);
            debugger;
        }
    }
    else {
        if (prevContext!==context) {
            qDebug("pop: got: ", context);
            qDebug("pop: expected: ", prevContext);
            debugger;
        }
    }
}
