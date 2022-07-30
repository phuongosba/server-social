const jwt = require("jsonwebtoken");
const _CONF = require("../common/config");
//kiểm tra login
const checkLogin = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  jwt.verify(token, _CONF.SECRET, function (err, decoded) {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized access.", err });
    } else {
      next();
    }
  });
};
//kiểm tra quyền update chủ tài khoản hoặc admin
const checkUpdate = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  jwt.verify(token, _CONF.SECRET, function (err, decoded) {
    if (err) {
      //if (err) throw new Error(err)
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized access.", err });
    } else {
      if (decoded._id === req.params.id || decoded._authorize === 1) {
        next();
      } else {
        return res.status(500).json({ message: "ID sai" });
      }
    }
  });
};
//kiểm tra quyền admin
const checkAdmin = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  jwt.verify(token, _CONF.SECRET, function (err, decoded) {
    if (err) {
      //if (err) throw new Error(err)
      console.log(err);
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized access.", err });
    } else {
      if (decoded._authorize === 1) {
        next();
      } else {
        return res.status(500).json({ message: "ID sai" });
      }
    }
  });
};
// kiểm tra quyền đăng thông báo
const checkFaculty = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  jwt.verify(token, _CONF.SECRET, function (err, decoded) {
    if (err) {
      //if (err) throw new Error(err)
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized access.", err });
    } else {
      if (decoded._authorize === 2 && decoded._faculty === req.params.id) {
        next();
      } else {
        return res.status(500).json({ message: "ID sai" });
      }
    }
  });
};
module.exports = { checkLogin, checkUpdate, checkAdmin, checkFaculty };
