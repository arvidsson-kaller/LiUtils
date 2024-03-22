import { Client } from 'pg';
import EnvVars from '@src/constants/EnvVars';

const db = new Client({
  connectionString: EnvVars.PostgreConnectionString,
});
db.connect();

export default db;