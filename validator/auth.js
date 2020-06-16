const { check } = require("express-validator");

exports.signupValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
exports.signInValidator = [
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password").exists().withMessage("password is required"),
];
