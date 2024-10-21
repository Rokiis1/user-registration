import { fileURLToPath } from "url";
import { dirname } from "path";
import swaggerJsdoc from "swagger-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Management API",
      version: "1.0.0",
      description:
        "Base URL: https://user-registration-wjqr.onrender.com/api/v1",
    },
    servers: [
      {
        url: "/api/v1",
      },
    ],
  },
  apis: [`${__dirname}/**/*.mjs`],
};

const specs = swaggerJsdoc(options);

export default specs;
