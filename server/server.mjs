import express from "express";
import dotenv from "dotenv";
import cors from "cors";

if (process.env.NODE_ENV === "prod") {
  dotenv.config({ path: ".env.prod" });
} else {
  dotenv.config({ path: ".env.dev" });
}

import passport from "./strategies/auth.mjs";

import routes from "./routes/index.mjs";
import { connectDB } from "./db/postgresConnection.mjs";
import { generalLimiter } from "./middleware/rateLimit.mjs";

const initializeDatabase = async () => {
  try {
    await connectDB();
    console.log("Database initialization complete");
  } catch (err) {
    console.error("Failed to initialize the database", err);
    process.exit(1);
  }
};

const startServer = async () => {
  await initializeDatabase();

  const app = express();
  const PORT = process.env.APP_PORT;

  const corsOptions = {};

  app.use(cors(corsOptions));

  app.use(express.json());

  app.use(passport.initialize());

  app.get("/api/v1/health", (req, res) => {
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

  app.use("/api/v1", generalLimiter, routes);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

(async () => {
  await startServer();
})();
