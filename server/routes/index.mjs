import express from "express";

import usersRoutes from "./usersRoutes.mjs";
import healthRoutes from "./healthRoutes.mjs";

const router = express.Router();

router.use("/check", healthRoutes);
router.use("/users", usersRoutes);

export default router;
