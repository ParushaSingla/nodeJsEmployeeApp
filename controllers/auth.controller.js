var bcrypt = require("bcryptjs");
var User = require("../models/user");
var Role = require("../models/role");
const { session } = require("passport");
class AuthController {
  static async signUp(req, res) {
    if(req.file) {
     console.log(req.file);
  }
    const user = new User({
      _id: Math.random().toString(36).substring(2, 6),
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    try {
      await user.save((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (req.body.roles) {
          Role.find(
            {
              name: { $in: req.body.roles },
            },
            (err, roles) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              user.roles = roles.map((role) => role._id);
              user.save((err) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
                req.flash("success_msg", "You have now registered!");
                res.redirect("/login");
              });
            }
          );
        }
      });
    } catch (err) {
      return next(err);
    }
  }

  static login(req, res) {
    var authorizedUser = req.user.toAuthJson();
    req.session.user = authorizedUser;
    res.cookie("jwt", authorizedUser.token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });
    res.redirect("/api/auth/listOfOpening");
  }
}

module.exports = AuthController;
