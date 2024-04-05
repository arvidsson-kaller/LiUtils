import * as express from 'express';
import EnvVars from '@src/constants/EnvVars';
import { UserId } from './models/User';
import JwtService from './services/JwtService';

export interface AuthenticatedRequest extends express.Request {
  user: AuthUser
}

export interface AuthUser {
  id: UserId,
  authProvider: string
}

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
): Promise<AuthUser> {
  if (securityName === 'jwt') {
    if (request.headers && request.headers['authorization']) {
      const auth = request.headers['authorization'];
      const token = auth.split('Bearer ')[1];
      const user = JwtService.decode(token);
      if (user !== null) {
        if(scopes?.includes('admin')){
          // TODO fix admin roles
          return Promise.reject(new Error('You are not admin'));
        }
        return Promise.resolve(user);
      }
    }
    return Promise.reject(new Error(`Invalid use of ${securityName}`));
  }
  if (securityName === 'api_key') {
    if (request.headers && request.headers['api-key']) {
      const token = request.headers['api-key'] as string;
      if (token === EnvVars.Auth.ApiKey) {
        // API KEY fulfills all scopes
        return Promise.resolve({
          id: 0 as UserId,
          authProvider: 'API-KEY',
        });
      }
    }
    return Promise.reject(new Error(`Invalid use of ${securityName}`));
  }
  return Promise.reject(new Error('Invalid security name'));
}
