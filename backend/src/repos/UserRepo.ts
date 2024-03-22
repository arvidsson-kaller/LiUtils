import Users from '@src/models/Users';
import db from './Database';
import { UsersInitializer } from '@src/models/Users';

async function getAll(): Promise<Users[]> {
  const res = await db.query('SELECT * from users');
  return res.rows;
}

async function create(user: UsersInitializer): Promise<void> {
  try {
    await db.query('INSERT INTO users (name) VALUES ($1)', [user.name]);
  } catch (error) {
    // Handle error appropriately
    throw new Error('Failed to create user');
  }
}

export default {
  getAll,
  create
} as const;
