function (context) {
    for (var i=this.context.length-1; i>=0; i--) {
        if (this.context[i]===context) {
            return true;
        }
    }
    return false;
}
