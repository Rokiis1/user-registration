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

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                     example: 1
 *                   first_name:
 *                     type: string
 *                     example: John
 *                   last_name:
 *                     type: string
 *                     example: Doe
 *                   email:
 *                     type: string
 *                     example: john.doe@example.com
 *                   role:
 *                     type: string
 *                     example: admin
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: 2021-01-01T00:00:00.000Z
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  usersController.getUsers,
);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search for a user by name
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the user
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *                 first_name:
 *                   type: string
 *                   example: John
 *                 last_name:
 *                   type: string
 *                   example: Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: Name cannot be empty
 */
router.get(
  "/search",
  validate(userValidationSchema.searchUserByName),
  passport.authenticate("jwt", { session: false }),
  isStudent,
  usersController.getUserByName,
);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *               repeatPassword:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 12345
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Validation errors
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: First name cannot be empty
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Error registering user
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.post(
  "/register",
  validate(userValidationSchema.userValidationSchema),
  usersController.registerUser,
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged in successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Email must be valid
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Error logging in user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Error logging in user
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
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

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user by ID
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User ID must be an integer
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Error deleting user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Error deleting user
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.delete(
  "/:userId",
  validate(userValidationSchema.getUserById),
  passport.authenticate("jwt", { session: false }),
  isStudent,
  usersController.deleteStudent,
);

/**
 * @swagger
 * /users/{userId}/students:
 *   post:
 *     summary: Create a student for a user
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *               phoneNumber:
 *                 type: string
 *                 example: +37060000000
 *               address:
 *                 type: string
 *                 example: 123 Main St
 *               enrollmentDate:
 *                 type: string
 *                 format: date
 *                 example: 2023-01-01
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Student created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                     phoneNumber:
 *                       type: string
 *                     address:
 *                       type: string
 *                     enrollmentDate:
 *                       type: string
 *                       format: date
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Validation error message
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post(
  "/:userId/students",
  validate(studentValidationSchema.createStudent),
  validate(userValidationSchema.getUserById),
  passport.authenticate("jwt", { session: false }),
  isStudent,
  studentsController.createStudent,
);

/**
 * @swagger
 * /users/{userId}/students/{studentId}:
 *   put:
 *     summary: Update a student by ID
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *               phoneNumber:
 *                 type: string
 *                 example: +37060000000
 *               address:
 *                 type: string
 *                 example: 123 Main St
 *               enrollmentDate:
 *                 type: string
 *                 format: date
 *                 example: 2023-01-01
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Student updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     student_id:
 *                       type: integer
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                     phoneNumber:
 *                       type: string
 *                     address:
 *                       type: string
 *                     enrollmentDate:
 *                       type: string
 *                       format: date
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Validation error message
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Student not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get(
  "/:userId/students/:studentId",
  validate(studentValidationSchema.getStudentById),
  passport.authenticate("jwt", { session: false }),
  isStudent,
  studentsController.getStudentById,
);

/**
 * @swagger
 * /users/{userId}/students/{studentId}:
 *   put:
 *     summary: Update a student by ID
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *               phoneNumber:
 *                 type: string
 *                 example: +37060000000
 *               address:
 *                 type: string
 *                 example: 123 Main St
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Student updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     student_id:
 *                       type: integer
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                     phoneNumber:
 *                       type: string
 *                     address:
 *                       type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Validation error message
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Student not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.put(
  "/:userId/students/:studentId",
  validate(studentValidationSchema.updateStudent),
  passport.authenticate("jwt", { session: false }),
  isStudent,
  studentsController.updateStudent,
);

/**
 * @swagger
 * /users/{userId}/students/{studentId}:
 *   patch:
 *     summary: Partially update a student by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *               phoneNumber:
 *                 type: string
 *                 example: +37060000000
 *               address:
 *                 type: string
 *                 example: 123 Main St
 *               enrollmentDate:
 *                 type: string
 *                 format: date
 *                 example: 2023-01-01
 *     responses:
 *       200:
 *         description: Student partially updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Student partially updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     student_id:
 *                       type: integer
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                     phoneNumber:
 *                       type: string
 *                     address:
 *                       type: string
 *                     enrollmentDate:
 *                       type: string
 *                       format: date
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Validation error message
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Student not found or does not belong to the specified user
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.patch(
  "/:userId/students/:studentId",
  validate(studentValidationSchema.partiallyUpdateStudent),
  passport.authenticate("jwt", { session: false }),
  isStudent,
  studentsController.partiallyUpdateStudent,
);

export default router;
