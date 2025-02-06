function (leadIn) {
    return this.getToolpathOptionInt(
                ("CamLead" + (leadIn ? "In" : "Out") + "Type"),
                Cam.LeadType.None);
}
