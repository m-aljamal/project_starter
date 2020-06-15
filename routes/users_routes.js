const router = require("express").Router();
const { signupValidator, signInValidator } = require("../validator/auth");
const { runValidation } = require("../validator");
const userController = require("../controllers/user_controller");
const middleware = require("../utils/middleware");

// @route   POST  /api/users/signup
// @desc    send email to user
// @access  public
router.post(
  "/signup",
  signupValidator,
  runValidation,
  userController.createUser
);

// @route   POST  /api/users/auth/activate
// @desc    Register user
// @access  public
router.post("/auth/activate", userController.activateUser);

// @route   GET  /api/users/getUser
// @desc    Get logedin user
// @access  Private
router.get(
  "/getUser",
  middleware.getUsetFromToken,
  userController.getLoggedinUser
);

// @route   POST  /api/users/signin
// @desc    Login user
// @access  public
router.post("/signin", signInValidator, runValidation, userController.signin);

module.exports = router;
