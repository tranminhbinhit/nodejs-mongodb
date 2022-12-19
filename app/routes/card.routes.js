  const userCtrl = require("../controllers/user.controller.js");

  var router = require("express").Router();

  //Api mongo
  router.post("/user/login", userCtrl.loginUser);
  router.post("/user/create", userCtrl.createUser);
  router.post("/user/update", userCtrl.updateUserInfo);
  router.get("/user/info/:id", userCtrl.getUserInfo);
  router.delete("/user/", userCtrl.deleteAll);
  router.get("/user", userCtrl.findAll);




  // // Retrieve all Tutorials
  // router.get("/", tutorials.findAll);

  // // Retrieve all published Tutorials
  // router.get("/published", tutorials.findAllPublished);

  // // Retrieve a single Tutorial with id
  // router.get("/:id", tutorials.findOne);

  // // Update a Tutorial with id
  // router.put("/:id", tutorials.update);

  // // Delete a Tutorial with id
  // router.delete("/:id", tutorials.delete);

  // // Create a new Tutorial
  // router.delete("/", tutorials.deleteAll);

  module.exports = router;
