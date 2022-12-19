const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

var router = require("express").Router();

// router.use(function(req, res, next) {
//   res.header(
//     "Access-Control-Allow-Headers",
//     "x-access-token, Origin, Content-Type, Accept"
//   );
//   next();
// });

router.post(
  "/signup",
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
  ],
  controller.signup
);

router.post("/signin", controller.signin);

router.post("/refreshtoken", controller.refreshToken);

module.exports = router;
