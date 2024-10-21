import express from "express";

import { studentsController } from "../controllers/index.mjs";
import { validate } from "../middleware/schemaValidator.mjs";
import { studentValidationSchema } from "../validation/index.mjs";

const router = express.Router();

router.get("/", studentsController.getStudents);

router.get(
  "/paginated",
  validate(studentValidationSchema.getPaginatedStudents),
  studentsController.getPaginatedStudents,
);

router.get(
  "/sorted-by-grade",
  validate(studentValidationSchema.getStudentsSortedByGrade),
  studentsController.getStudentsSortedByGrade,
);

router.get(
  "/filter-by-course",
  validate(studentValidationSchema.getFilteredStudentsByCourse),
  studentsController.getFilteredStudentsByCourse,
);

export default router;
