function (withMachine) {
    if (isNull(withMachine)) {
        withMachine = true;
    }
    var className = this.name;
    if (!withMachine && className.contains("#")) {
        // config alias:
        className = className.split("#")[0];
    }
    return className;
}
