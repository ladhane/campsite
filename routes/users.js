const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");

router
   .route("/register")
   .get(users.showRegisterForm)
   .post(users.registerAUser);

router
  .route("/login")
  .get(users.showLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    users.loginAUser
  );

router.get("/logout", users.logout);

module.exports = router;
