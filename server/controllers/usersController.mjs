import bcrypt from "bcrypt";
import { usersModel } from "../models/index.mjs";

const usersController = {
  getUsers: async (req, res) => {
    try {
      const users = await usersModel.getUsers();

      res.status(200).json({
        status: "success",
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Internal Server Error, ${error}`,
      });
    }
  },

  getUserByName: async (req, res) => {
    const { name } = req.query;
    try {
      const user = await usersModel.getUserByName(name);

      res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Internal Server Error, ${error}`,
      });
    }
  },

  registerUser: async (req, res) => {
    const { firstName, lastName, email, password, repeatPassword } = req.body;

    try {
      if (password !== repeatPassword) {
        return res.status(400).json({
          status: "error",
          message: "Passwords do not match",
        });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const registeredUser = await usersModel.registerUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: registeredUser,
      });
    } catch (error) {
      console.error("Error registering user:", error.stack);
      res.status(500).json({
        status: "error",
        message: "Error registering user",
        error: error.message,
      });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await usersModel.login({ email, password });

      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Invalid email or password",
        });
      }

      res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error logging in user",
        error: error.message,
      });
    }
  },

  deleteStudent: async (req, res) => {
    const { userId } = req.params;
    try {
      const deletedUser = await usersModel.deleteUser(userId);

      if (deletedUser === -1) {
        return res.status(404).json({
          status: "error",
          message: "Student not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Student deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `Internal Server Error, ${error}`,
      });
    }
  },
};

export default usersController;
