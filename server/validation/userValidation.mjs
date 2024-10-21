import { checkSchema } from "express-validator";
import { usersModel } from "../models/index.mjs";

export const userValidationSchema = {
  userValidationSchema: checkSchema({
    firstName: {
      isLength: {
        options: { max: 50 },
        errorMessage: "First name must be at most 50 characters",
      },
      notEmpty: {
        errorMessage: "First name cannot be empty",
      },
      isString: {
        errorMessage: "First name must be a string",
      },
    },
    lastName: {
      isLength: {
        options: { max: 50 },
        errorMessage: "Last name must be at most 50 characters",
      },
      notEmpty: {
        errorMessage: "Last name cannot be empty",
      },
      isString: {
        errorMessage: "Last name must be a string",
      },
    },
    email: {
      isEmail: {
        errorMessage: "Email must be valid",
      },
      isLength: {
        options: { max: 100 },
        errorMessage: "Email must be at most 100 characters",
      },
      notEmpty: {
        errorMessage: "Email cannot be empty",
      },
      custom: {
        options: async (value) => {
          const existingUser = await usersModel.getUserByEmail({
            email: value,
          });
          if (existingUser) {
            throw new Error("Email already exists.");
          }
        },
      },
    },
    password: {
      isLength: {
        options: { min: 8, max: 128 },
        errorMessage: "Password must be between 8 and 128 characters",
      },
      matches: {
        options:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&~#^_+=\-';,./|":<>?])[A-Za-z\d@$!%*?&~#^_+=\-';,./|":<>?]{8,128}$/,
        errorMessage:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
      notEmpty: {
        errorMessage: "Password cannot be empty",
      },
    },
    repeatPassword: {
      notEmpty: {
        errorMessage: "Repeat password cannot be empty",
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Passwords do not match");
          }
          return true;
        },
      },
    },
  }),

  login: checkSchema({
    email: {
      isEmail: {
        errorMessage: "Email must be valid",
      },
      notEmpty: {
        errorMessage: "Email cannot be empty",
      },
    },
    password: {
      isLength: {
        options: { min: 6 },
        errorMessage: "Password must be at least 6 characters",
      },
      notEmpty: {
        errorMessage: "Password cannot be empty",
      },
    },
  }),

  searchUserByName: checkSchema({
    name: {
      in: ["query"],
      isString: {
        errorMessage: "Name must be a string",
      },
      notEmpty: {
        errorMessage: "Name cannot be empty",
      },
    },
  }),

  getUserById: checkSchema({
    userId: {
      in: ["params"],
      isInt: {
        errorMessage: "User ID must be an integer",
      },
    },
  }),
};
