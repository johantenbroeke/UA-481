function (msg) {
    var msgIndent;
    if (!isNull(this.indent)) {
        msgIndent = new Array(this.indent + 2).join("&nbsp;") + msg;
    }
    else {
        msgIndent = msg;
    }
    qWarning(msgIndent.replace(/&nbsp;/g, " "));
    // never show as dialog:
    //EAction.handleUserWarning(msgIndent, false);
    var red = "#cc0000";
    if (RSettings.hasDarkGuiBackground()) {
        red = "#FF6060";
    }
    EAction.handleUserMessage("<span style='color:" + red + ";'>" + msgIndent + "</span>", false);
}
