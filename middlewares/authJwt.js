const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Role = require("../models/role");
verifyToken = (req, res, next) => {
  const token = req.cookies.jwt || "";
  if (!token) {
    return res.status(403).send({status: 403, message: "No token provided!"});
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({status:401, message: "Unauthorized user!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isEmployee = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return next(err);
    }
    req.user = user;
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          return next(err);
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "employee") {
            req.userRole = roles[i].name;
            next();
            return;
          }
        }
        res.status(403).send({status:403,message: "Require Employee Role!" });
        return;
      }
    );
  });
};

isManager = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return next(err);
    }
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          return next(err);
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "manager") {
            req.userRole = roles[i].name;
            next();
            return;
          }
        }
        res.status(403).send({status:403, message: "Require Manager Role!" });
        return;
      }
    );
  });
};

getRoleFromId = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return next(err);
    }
    req.user = user;
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          return next(err);
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "employee" || roles[i].name === "manager") {
            req.userRole = roles[i].name;
            req.userRoleId = roles[i]._id;
            next();
            return;
          }
        }
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isEmployee,
  isManager,
  getRoleFromId,
};
module.exports = authJwt;
