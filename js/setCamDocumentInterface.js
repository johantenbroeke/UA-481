function (camDocumentInterface) {
    this.camDocumentInterface = camDocumentInterface;
    if (!isNull(camDocumentInterface)) {
        this.camDocument = camDocumentInterface.getDocument();
    }
    else {
        this.camDocument = undefined;
    }
}
