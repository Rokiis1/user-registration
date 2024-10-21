import express from "express";

const router = express.Router();

/**
 * @swagger
 *  /check/health:
 *   get:
 *     summary: Check the health of the server
 *     responses:
 *       200:
 *         description: Server is healthy
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
 *                   example: Server is healthy
 *       500:
 *         description: Internal Server Error
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
 *                   example: Internal Server Error, {error}
 */
router.get("/health", (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: "Server is healthy",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: `Internal Server Error, ${error}`,
    });
  }
});

export default router;