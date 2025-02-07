function (entity, leadIn) {
    return this.getToolpathOptionFloat(
                ("CamLead" + (leadIn ? "In" : "Out") + "Angle"),
                (leadIn ? this.leadInAngle : this.leadOutAngle));
}
