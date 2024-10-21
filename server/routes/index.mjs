import express from "express";

import studentsRoutes from "./studentsRoutes.mjs";
import usersRoutes from "./usersRoutes.mjs";

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/students", studentsRoutes);

export default router;
