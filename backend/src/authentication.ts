import * as express from "express";
import EnvVars from "@src/constants/EnvVars";
import { UserId } from "./models/User";
import JwtService from "./services/JwtService";
import { InvalidContextError } from "./other/classes";
import { NodeEnvs } from "./constants/misc";

export interface AuthenticatedRequest extends express.Request {
  user: AuthUser;
}

export interface AuthUser {
  id: UserId;
  authProvider: string;
}

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
): Promise<AuthUser> {
  if (securityName === "jwt") {
    // If server is in dev mode, ONLY userId is a valid jwt
    if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
      const auth = Number(
        request.headers["authorization"]?.split("Bearer ")[1],
      );
      return Promise.resolve({
        id: auth as UserId,
        authProvider: "none",
      });
    }
    if (request.headers && request.headers["authorization"]) {
      const auth = request.headers["authorization"];
      const token = auth.split("Bearer ")[1];
      const user = JwtService.decode(token);
      if (user !== null) {
        if (scopes?.includes("admin")) {
          // TODO fix admin roles
          return Promise.reject(new InvalidContextError("You are not admin"));
        }
        return Promise.resolve(user);
      }
    }
    return Promise.reject(
      new InvalidContextError(`Invalid use of ${securityName}`),
    );
  }
  if (securityName === "api_key") {
    if (request.headers && request.headers["api-key"]) {
      const token = request.headers["api-key"] as string;
      if (token === EnvVars.Auth.ApiKey) {
        // API KEY fulfills all scopes
        return Promise.resolve({
          id: 0 as UserId,
          authProvider: "API-KEY",
        });
      }
    }
    return Promise.reject(
      new InvalidContextError(`Invalid use of ${securityName}`),
    );
  }
  return Promise.reject(new InvalidContextError("Invalid security name"));
}
