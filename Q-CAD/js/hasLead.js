function (leadIn) {
    var leadType = this.getLeadType(leadIn);
    if (isNull(leadType) || leadType===Cam.LeadType.None) {
        return false;
    }
    return true;
}
