const opening = require("../models/opening");
const User = require("../models/user");
var EventEmitter = require("../notification/notification");
const authJwt = require("../middlewares/authJwt");
class UserController {
  static async getOpeningList(req, res) {
    const openings = await opening.find({}).populate("createdBy", "-__v");
    const createOpening = req.userRole === "manager";
    try {
      res.render("./../views/openingList", {
        message: "Opening List",
        openingList: openings,
        createOpening: createOpening,
        loggedUserId: req.userId,
      });
    } catch (err) {
      return next(err);
    }
  }
  static async applyForOpening(req, res) {
    var appliedUser = await User.findById(req.userId);
    let alreadyApplied = false;
    opening.findById(req.params.openingId, async (err, openingDetail) => {
      if (openingDetail) {
        openingDetail.employeesApplied.forEach((user) => {
          if (user === appliedUser._id) {
            alreadyApplied = true;
          }
        });
        if (!alreadyApplied) {
          openingDetail.employeesApplied.push(appliedUser);
          try {
            await openingDetail.save();
            EventEmitter.emit("AppliedForOpening", appliedUser._id);
            req.flash("success_msg", "You have are applied for the respective opening");
            res.redirect("/api/auth/listOfOpening");
          } catch (err) {
            return res.status(500).send(err);
          }
        } else {
          req.flash("error_msg", "Already you have applied");
          res.redirect("/api/auth/listOfOpening");
          // res.status(500).send({ message: "Already you have applied" });
        }
      }
    });
  }
  static async detaiOpening(req, res) {
    opening.findById(req.params.openingId, (err, openingDetail) => {
      if (err) {
        res.send(err);
      } else {
        try {
          res.render("./../views/detailOpening", {
            message: "Detail Of Opening",
            opening: openingDetail,
            applyButton: req.userRole === "manager" ? false : true,
            canApply: openingDetail.status === "closed" ? false : true,
          });
        } catch (err) {
          return next(err);
        }
      }
    });
  }
}
module.exports = UserController;
