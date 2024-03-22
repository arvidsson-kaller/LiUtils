import { Client } from 'pg'

const db = new Client({
    connectionString: process.env.POSTGRES_URL,
})
db.connect();

export default db;