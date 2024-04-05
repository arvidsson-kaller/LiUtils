import { Service } from "./backend-client";

/**
 * Api Key authenticated backend service, usable from server side only.
 */
export const BackendService = new Service({
  BASE: process.env.BACKEND_URL ?? "",
  HEADERS: {
    "api-key": process.env.BACKEND_API_KEY ?? "",
  },
}).default;

/**
 * User authenticated backend service, usable from server side only.
 * @param jwt jwt of user
 * @returns
 */
export const getUserBackendService = (jwt: string) =>
  new Service({
    BASE: process.env.BACKEND_URL ?? "",
    TOKEN: jwt,
  }).default;

/**
 * Proxy for the backend server, usable from client side only.
 * No authentication is needed here, since the proxy takes care of that.
 */
export const ProxyBackendService = new Service({
  BASE: "/api/backend/",
}).default;
