import * as express from 'express';
import EnvVars from '@src/constants/EnvVars';
import UserRepo from './repos/UserRepo';
import User, { UserId } from './models/User';

export interface AuthenticatedRequest extends express.Request {
    user: User
};

export async function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[],
): Promise<User> {
    if (securityName === 'api_key') {
        if (request.headers && request.headers['api-key']) {
            const token = request.headers['api-key'] as string;
            if (token.startsWith(EnvVars.Auth.ApiKey)) {
                // Api key is okay
                const userId = parseInt(token.split(EnvVars.Auth.ApiKey)[1]) as UserId;
                if (scopes && scopes.includes('Admin')) {
                    // TODO, fix admin roles
                    Promise.reject(new Error('You are not admin'));
                }
                try {
                    const user = await UserRepo.findById(userId);
                    return user; // will be available as request.user
                } catch (e) {
                    Promise.reject(new Error('User not found'));
                }
            }
        }
    }

    return Promise.reject(new Error('Invalid security name'));
}
