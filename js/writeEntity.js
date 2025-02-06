function () {
//    var s = this.currentEntity.castToShape();
//    print("---");
//    print("from: ", s.getStartPoint().x, s.getStartPoint().y, s.getStartPoint().z);
//    print("  to: ", s.getEndPoint().x, s.getEndPoint().y, s.getEndPoint().z);
    var side = this.getToolpathOptionInt("CamSide", Cam.Side.None);
    // G41/G42:
    var compensationOn = this.getEntityOptionBool(this.currentEntity, "CamCompensationOn", false);
    // G40:
    var compensationOff = this.getEntityOptionBool(this.currentEntity, "CamCompensationOff", false);
    // side of compensation:
    var dir = this.getEntityOptionInt(this.currentEntity, "CamDirection", -1);
    if (side===Cam.Side.None) {
        // side is "on": no compensation:
        compensationOn = false;
        compensationOff = false;
    }
    // first / last rapid move to safety:
//    var firstMove = this.getEntityOptionBool(this.currentEntity, "CamFirstMove", false);
    //var lastMove = this.getEntityOptionBool(this.currentEntity, "CamLastMove", false);
    var zMove = this.getEntityOptionBool(this.currentEntity, "CamZMove", false);
    var unknownPosition = this.getEntityOptionBool(this.currentEntity, "CamUnknownPosition", false);
    var rapid = this.getEntityOptionBool(this.currentEntity, "CamRapidMove", false);
    var point = this.getEntityOptionBool(this.currentEntity, "CamPoint", false);
    var leadIn = this.getEntityOptionBool(this.currentEntity, "CamLeadIn", false);
    var leadOut = this.getEntityOptionBool(this.currentEntity, "CamLeadOut", false);
//    // write move to start of contour:
    if (unknownPosition) {
//        // move to Z safety level (very first move):
//        var sp = this.currentEntity.getStartPoint();
//        this.xPosition = undefined;
//        this.yPosition = undefined;
//        this.zPosition = sp.z;
//        this.writeRapidMoveZ();
//        // move to X/Y:
//        var ep = this.currentEntity.getEndPoint();
//        this.xPosition = ep.x;
//        this.yPosition = ep.y;
//        this.zPosition = ep.z;
//        this.writeRapidMove();
    }
    // entity is rapid move:
    // write rapid move:
    else if (rapid===true && isLineEntity(this.currentEntity)) {
        if (this.currentEntity.getLength()>RS.PointTolerance || unknownPosition) {
            if (zMove) {
                this.writeRapidMoveZ();
            }
            else {
                // e.g. N10 G00 X4 Y3
                this.writeRapidMove();
            }
            this.lastMoveGCode = -1;
            //this.feedRatePrevious = "";
        }
    }
    else {
        // linear move:
        if (isLineEntity(this.currentEntity)) {
            if (compensationOn===true) {
                if (dir===Cam.Direction.ClimbLeft) {
                    // e.g. N10 G42 X4 Y3
                    this.writeLinearMoveCompensationLeft();
                }
                else if (dir===Cam.Direction.ConventionalRight) {
                    // e.g. N10 G41 X4 Y3
                    this.writeLinearMoveCompensationRight();
                }
            }
            else if (compensationOff===true) {
                // e.g. N10 G40 X4 Y3
                this.writeLinearMoveCompensationOff();
            }
            else {
                if (zMove) {
                    if (point) {
                        // drilling:
                        if (this.lastMoveGCode===1) {
                            this.writePointMoveZ();
                        }
                        else {
                            this.writeFirstPointMoveZ();
                        }
                    }
                    else {
                        // Z down:
                        if (this.lastMoveGCode===1) {
                            this.writeLinearMoveZ();
                        }
                        else {
                            this.writeFirstLinearMoveZ();
                        }
                    }
                }
                else {
                    // X/Y move:
                    if (this.lastMoveGCode===1) {
                        if (leadIn && this.hasBlock("linearLeadIn")) {
                            this.writeLinearLeadIn();
                        }
                        else if (leadOut && this.hasBlock("linearLeadOut")) {
                            this.writeLinearLeadOut();
                        }
                        else {
                            // e.g. N10 X4 Y3
                            this.writeLinearMove();
                        }
                    }
                    else {
                        // e.g. N10 G1 X4 Y3
                        this.writeFirstLinearMove();
                    }
                }
            }
        }
        else if (isArcEntity(this.currentEntity)) {
            var c = this.currentEntity.getCenter();
            this.iArcCenter = c.x;
            this.jArcCenter = c.y;
            this.iArcCenterInc = c.x - this.xStartPosition;
            this.jArcCenterInc = c.y - this.yStartPosition;
            this.iArcCenterAbs = c.x;
            this.jArcCenterAbs = c.y;
            this.arcRadius = this.currentEntity.getRadius();
            this.arcDiameter = this.arcRadius*2;
            this.arcSweep = this.currentEntity.getSweep();
            if (this.currentEntity.isReversed()) {
                if (leadIn && this.hasBlock("arcCWLeadIn")) {
                    this.writeArcCWLeadIn();
                }
                else if (leadOut && this.hasBlock("arcCWLeadOut")) {
                    this.writeArcCWLeadOut();
                }
                else {
                    if (this.lastMoveGCode===2) {
                        this.writeArcCWMove();
                    }
                    else {
                        this.writeFirstArcCWMove();
                    }
                }
            }
            else {
                if (leadIn && this.hasBlock("arcCCWLeadIn")) {
                    this.writeArcCCWLeadIn();
                }
                else if (leadOut && this.hasBlock("arcCCWLeadOut")) {
                    this.writeArcCCWLeadOut();
                }
                else {
                    if (this.lastMoveGCode===3) {
                        this.writeArcCCWMove();
                    }
                    else {
                        this.writeFirstArcCCWMove();
                    }
                }
            }
        }
    }
    this.currentEntity = undefined;
}
