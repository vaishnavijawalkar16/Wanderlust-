const express = require("express");
const router = express.Router({mergeParams: true });
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { isLoggedIn , saveRedirectUrl} = require("../middleware.js");
const userscontroller = require("../controllers/users.js");

router.get(
  "/signup", 
  (req,res)=>{
  res.render("users/signup.ejs");
});

router.post(
  "/signup", 
  wrapAsync(userscontroller.signup)
);

router.get(
  "/login", 
  (req,res)=>{
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl, 
  passport.authenticate("local", {
  failureFlash: true,
  failureRedirect: "/login"
  }), 
  userscontroller.login
);

router.get(
  "/logout", 
  userscontroller.logout 
);

module.exports = router;