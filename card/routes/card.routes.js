  const tutorials = require("../controllers/tutorial.controller.js");
  const userCtrl = require("../controllers/user.controller.js");

  var router = require("express").Router();

  //Connect to database
  const db = require("../models");
  db.mongoose
    .connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Connected to the database!");
    })
    .catch(err => {
      console.log("Cannot connect to the database!", err);
      process.exit();
    });

  //Api mongo
  router.post("/", tutorials.create);

  router.post("/user/login", userCtrl.loginUser);
  router.post("/user/create", userCtrl.createUser);
  router.post("/user/update", userCtrl.updateUserInfo);
  router.get("/user/info/:id", userCtrl.getUserInfo);
  router.delete("/user/", userCtrl.deleteAll);
  router.get("/user", userCtrl.findAll);






  // Retrieve all Tutorials
  router.get("/", tutorials.findAll);

  // Retrieve all published Tutorials
  router.get("/published", tutorials.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", tutorials.findOne);

  // Update a Tutorial with id
  router.put("/:id", tutorials.update);

  // Delete a Tutorial with id
  router.delete("/:id", tutorials.delete);

  // Create a new Tutorial
  router.delete("/", tutorials.deleteAll);

  module.exports = router;
