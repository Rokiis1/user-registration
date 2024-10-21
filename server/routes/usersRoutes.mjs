import express from "express";
import jwt from "jsonwebtoken";
import { usersController, studentsController } from "../controllers/index.mjs";
import {
  userValidationSchema,
  studentValidationSchema,
} from "../validation/index.mjs";
import { validate } from "../middleware/schemaValidator.mjs";
import passport from "../strategies/auth.mjs";
import { isAdmin, isStudent } from "../middleware/roleCheck.mjs";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  usersController.getUsers,
);

router.get(
  "/search",
  validate(userValidationSchema.searchUserByName),
  usersController.getUserByName,
);

router.post(
  "/register",
  validate(userValidationSchema.userValidationSchema),
  usersController.registerUser,
);

router.post(
  "/login",
  validate(userValidationSchema.login),
  passport.authenticate("local", { session: false }),
  isStudent,
  (req, res) => {
    const token = jwt.sign(
      { user_id: req.user.user_id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.status(200).json({ message: "Logged in successfully.", token });
  },
);

router.delete(
  "/:userId",
  validate(userValidationSchema.getUserById),
  passport.authenticate("jwt", { session: false }),
  isStudent,
  usersController.deleteStudent,
);

router.post(
  "/:userId/students",
  validate(studentValidationSchema.createStudent),
  validate(userValidationSchema.getUserById),
  passport.authenticate("jwt", { session: false }),
  isStudent,
  studentsController.createStudent,
);

router.get(
  "/:userId/students/:studentId",
  validate(studentValidationSchema.getStudentById),
  studentsController.getStudentById,
);

router.put(
  "/:userId/students/:studentId",
  validate(studentValidationSchema.updateStudent),
  studentsController.updateStudent,
);

router.patch(
  "/:userId/students/:studentId",
  validate(studentValidationSchema.partiallyUpdateStudent),
  studentsController.partiallyUpdateStudent,
);

export default router;
