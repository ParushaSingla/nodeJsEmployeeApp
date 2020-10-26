const Validator = require("validatorjs");
const validator = (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

const signup = (req, res, next) => {
  const validationRule = {
    username: "required|string",
    password: "required|string|min:6",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};
const createOpening = (req, res, next) => {
  const validationRule = {
    projectName: "required|string",
    clientName: "required|string",
    technologies: "required|string",
    role: "required|string",
    jobDescription: "required|string",
    status: "required|string",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else if (req.body.status != "open" && req.body.status != "closed") {
      res.status(412).send({ message: "status can be either open or closed" });
    } else {
      next();
    }
  });
};

module.exports = {
  validator: validator,
  signup: signup,
  createOpening: createOpening,
};
