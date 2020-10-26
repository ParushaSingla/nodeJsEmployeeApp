const express = require("express");
const router = express.Router();
const authJwt = require("../middlewares/authJwt");
const userController = require("../controllers/user.controller");
const mangerController = require("../controllers/manager.controller");
const validateParams = require("../validation/validation");
router.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user.username;
    next();
  } else {
    res.clearCookie('session-key');
    res.clearCookie('jwt');
    let err = new Error("You are not logged in ");
    err.status = 403;
    return next(err);
  }
});
router.get(
  "/auth/listOfOpening",
  [authJwt.verifyToken, authJwt.getRoleFromId],
  userController.getOpeningList
);
router.post(
  "/auth/createOpening",
  [authJwt.verifyToken, authJwt.isManager],
  validateParams.createOpening,
  mangerController.createOrUpdateOpening
);
router.put(
  "/auth/createOpening",
  [authJwt.verifyToken, authJwt.isManager],
  validateParams.createOpening,
  mangerController.createOrUpdateOpening
);
router.get(
  "/auth/detailOpening/:openingId",
  [authJwt.verifyToken, authJwt.getRoleFromId],
  userController.detaiOpening
);
//redirect to update opening page 
router.get(
  "/auth/update/:openingId",
  [authJwt.verifyToken, authJwt.isManager],
  mangerController.updateOpeningPage
);
router.get(
  "/auth/apply/:openingId",
  [authJwt.verifyToken, authJwt.isEmployee],
  userController.applyForOpening
);

module.exports = router;
