var express = require("express");
var router = express.Router();
const passport = require("passport");
const authController = require("../controllers/auth.controller");
const validateParams = require("../validation/validation");
const multer = require('multer');
const upload = multer({dest: __dirname + '/uploads/images'});
//register a new user
router.post("/api/signUp", validateParams.signup, authController.signUp);
//login to the portal
router.post(
  "/api/signIn",
  passport.authenticate("local", {
    session: false,
    failureRedirect: "/login",
    failureFlash: true,
  }),
  authController.login
);

module.exports = router;
