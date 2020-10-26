const opening = require("../models/opening");
const user = require("../models/user");
const EventEmitter = require("../notification/notification");
class ManagerController {
  //create a opening if not there otherwise update the opening save data  to database
  static async createOrUpdateOpening(req, res) {
    if (req.body._id) {
      const updateOpening = new opening(req.body);
      opening
        .findByIdAndUpdate(req.body._id, updateOpening, { useFindAndModify: false})
        .then((updatedOpening) => {
          if (updateOpening.status == "closed") {
            EventEmitter.emit("openingClosed", updateOpening);
          }
          res.redirect("/api/auth/listOfOpening");
        })
        .catch((err) => {
          return res.status(500).send({
            message: "Error updating opening ",
          });
        });
    } else {
      if(req.body.status==="closed")
      {
        return res.status(412).send({ message: "status while creating cannot be closed" });
      }
      const newOpening = new opening(req.body);
      newOpening.createdBy = await user.findById(req.userId);
      newOpening._id = Math.random().toString(36).substring(2, 6);
      newOpening.employeesApplied=[];
      try {
        await newOpening.save();
        res.redirect("/api/auth/listOfOpening");
      } catch (err) {
        return next(err);
      }
    }
  }
  //it will find the opening with id and redirect to update page
  static async updateOpeningPage(req, res) {
    opening
      .findById(req.params.openingId, (err, openingDetail) => {
        if (err) {
          res.send(err);
        } else {
          try {
            res.render("./../views/createOpening", {
              message: "Update Opening",
              opening: openingDetail,
              buttonName: "UPDATE",
            });
          } catch (err) {
            return next(err);
          }
        }
      })
      .populate("createdBy", "-__v");
  }
}
module.exports = ManagerController;
