import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 50 })
    .withMessage("Name must not exceed 50 characters."),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters.")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can contain only letters, numbers and underscores."),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];

export const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required."),
];
