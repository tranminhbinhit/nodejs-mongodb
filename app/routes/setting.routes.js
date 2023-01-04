  const settingCtrl = require("../controllers/setting.controller.js");
  const { authJwt } = require("../middlewares");
  var router = require("express").Router();

  router.post("/createUpdate", [authJwt.verifyToken], settingCtrl.createSetting);
  router.get("/list", settingCtrl.findAll);

  module.exports = router;
