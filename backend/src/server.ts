/**
 * Setup express server.
 */

import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import logger from "jet-logger";

import "express-async-errors";

import EnvVars from "@src/constants/EnvVars";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import { NodeEnvs } from "@src/constants/misc";
import { InvalidContextError, RouteError } from "@src/other/classes";

import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";

import { RegisterRoutes } from "@src/routes";

// **** Variables **** //

const app = express();

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan("dev"));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Set static directory
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// Register swagger routes
RegisterRoutes(app); // eslint-disable-line

app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  }),
);

// Add error handler
app.use(
  (
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
      logger.err(err, true);
    }
    if (err instanceof ValidateError) {
      logger.warn(`Caught Validation Error for ${req.path}:`);
      return res.status(422).json({
        message: "Validation Failed",
        details: err?.fields,
      });
    }
    let status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    if (err instanceof RouteError) {
      status = err.status;
    } else if (err instanceof InvalidContextError) {
      status = HttpStatusCodes.BAD_REQUEST;
    }
    return res.status(status).json({ error: err.message });
  },
);

// **** Export default **** //
export default app;
