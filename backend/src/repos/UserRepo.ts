import db from './Database';
import User, { UserId, UserInitializer } from '@src/models/User';
import { InvalidContextError } from '@src/other/classes';
import logger from 'jet-logger';

async function getAll(): Promise<User[]> {
  const res = await db.query('SELECT * from "User"');
  return res.rows as User[];
}

async function create(user: UserInitializer): Promise<User> {
  if (user.authProvider == null && user.authUserId != null) {
    throw new InvalidContextError('Can not set authUserId without authProvider');
  }
  if (user.authProvider != null && user.authUserId == null) {
    throw new InvalidContextError('Can not set authProvider without authUserId');
  }
  try {
    const sql = 'INSERT INTO "User" (name, email, "authProvider", "authUserId") VALUES ($1, $2, $3, $4) RETURNING *';
    const data: string[] = [user.name, user.email, user.authProvider as string, user.authUserId as string];
    const result = await db.query(sql, data);
    const createdUser: User = result.rows[0] as User;
    return createdUser;
  } catch (error) {
    logger.err(error);
    throw new Error('Failed to create user');
  }
}

async function findById(userId: UserId): Promise<User> {
  const res = await db.query('SELECT * from "User" where id = ($1)', [userId]);
  if (res.rows.length == 1) {
    return res.rows[0] as User;
  }
  throw new Error('Not found');
}

async function findByOAuth(authProvider: string, authUserId: string): Promise<User | null> {
  const res = await db.query(
    'SELECT * from "User" where "authProvider" = ($1) AND "authUserId" = ($2)',
    [authProvider, authUserId]);
  if (res.rows.length == 1) {
    return res.rows[0] as User;
  }
  return null;
}

export default {
  getAll,
  create,
  findById,
  findByOAuth,
} as const;
