import db from './Database';
import User, { UserId, UserInitializer } from '@src/models/User';
import logger from 'jet-logger';

async function getAll(): Promise<User[]> {
  const res = await db.query('SELECT * from "User"');
  return res.rows as User[];
}

async function create(user: UserInitializer): Promise<void> {
  try {
    await db.query('INSERT INTO "User" (name, email) VALUES ($1, $2)',
      [user.name, user.email]);
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

export default {
  getAll,
  create,
  findById,
} as const;
