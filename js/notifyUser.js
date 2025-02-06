function (msg) {
    var msgIndent;
    if (!isNull(this.indent)) {
        msgIndent = new Array(this.indent + 2).join("&nbsp;") + msg;
    }
    else {
        msgIndent = msg;
    }
    qDebug(msgIndent.replace(/&nbsp;/g, " "));
    EAction.handleUserMessage(msgIndent, false);
    if (!isNull(this.progressDialog)) {
        this.progressDialog.labelText = msg;
    }
    //QCoreApplication.processEvents();
}
