const { resultApiCreateUpdate } = require("../../src/utils/utils");
const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // userName
  User.findOne({
    userName: req.body.userName
  }).exec((err, user) => {
    if (err) {
      res.status(500).send(resultApiCreateUpdate(-1, err));
      return;
    }

    if (user) {
      res.status(400).send(resultApiCreateUpdate(0, "Tài khoản đã tồn tại!"));
      return;
    }

    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send(resultApiCreateUpdate(-1, err));;
        return;
      }

      if (user) {
        res.status(400).send(resultApiCreateUpdate(-1, "Email đã tồn tại"));
        return;
      }

      next();
    });
  });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
