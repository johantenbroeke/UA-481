function (leadIn) {
    return this.getToolpathOptionFloat(
                ("CamLead" + (leadIn ? "In" : "Out") + "Size"),
                (leadIn ? this.leadInSize : this.leadOutSize));
}
