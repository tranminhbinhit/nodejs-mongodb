  const userCtrl = require("../controllers/user.controller.js");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();

  router.post("/update", [authJwt.verifyToken], userCtrl.updateUserInfo);
  router.get("/info",[authJwt.verifyToken], userCtrl.getUserInfo); 
  router.get("/info/:userName", userCtrl.getUserInfoByUser);
  router.get("/", userCtrl.findAll);

  module.exports = router;
