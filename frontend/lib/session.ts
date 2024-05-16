import { User, getServerSession } from "next-auth";
import { UserDTO } from "./backend-client";
import { getUserBackendService } from "./backend";

export const session = async (data: any) => {
  data.session.user.backendJwt = data.token.backendJwt;
  data.session.user.me = data.token.me;
  return data.session;
};

export interface AuthedUser extends User {
  backendJwt: string;
  me: UserDTO;
}

/**
 * DO NOT EXPOSE TO FRONTEND, ONLY USE SERVER SIDE
 * @returns
 */
export const getUserAuthSession = async (): Promise<AuthedUser> => {
  const authUserSession = await getServerSession({
    callbacks: {
      session,
    },
  });
  return authUserSession?.user;
};

/**
 * User authenticated backend service, usable from server side only.
 * @param jwt jwt of user
 * @returns
 */
export const getUserSessionBackendService = async () => {
  const authUserSession = await getServerSession({
    callbacks: {
      session,
    },
  });
  return getUserBackendService(authUserSession?.user?.backendJwt);
};

/**
 * Can only be called from Server side, but contents can be passed to client side component safely
 * @returns
 */
export const getUserSession = async (): Promise<UserDTO | undefined> => {
  const authUserSession = await getServerSession({
    callbacks: {
      session,
    },
  });
  return authUserSession?.user?.me;
};
