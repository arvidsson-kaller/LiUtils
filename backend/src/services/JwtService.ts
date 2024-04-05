import jwt from "jsonwebtoken";
import EnvVars from "@src/constants/EnvVars";
import { AuthUser } from "@src/authentication";
import User from "@src/models/User";

const encode = (user: User): string => {
  const data: AuthUser = {
    id: user.id,
    authProvider: user.authProvider!,
  };
  const token = jwt.sign(data, EnvVars.Auth.Jwt.Secret);
  return token;
};

const decode = (token: string): AuthUser | null => {
  try {
    const decoded = jwt.verify(token, EnvVars.Auth.Jwt.Secret) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
};

export default {
  decode,
  encode,
} as const;
