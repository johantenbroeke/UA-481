function () {
    if (this.context.length===0) {
        return undefined;
    }
    return this.context[this.context.length-1];
}
