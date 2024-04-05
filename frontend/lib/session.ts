import { User, getServerSession } from "next-auth";

export const session = async (data: any) => {
  data.session.user.backendJwt = data.token.backendJwt;
  return data.session;
};

export interface AuthedUser extends User {
  backendJwt: string;
}

export const getUserSession = async (): Promise<AuthedUser> => {
  const authUserSession = await getServerSession({
    callbacks: {
      session,
    },
  });
  return authUserSession?.user;
};
