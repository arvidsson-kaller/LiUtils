import { Pool, PoolClient } from "pg";
import EnvVars from "@src/constants/EnvVars";

const db = new Pool({
  connectionString: EnvVars.PostgreConnectionString,
});

export const useTransaction = async (
  callback: (client: PoolClient) => Promise<void>,
) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    await callback(client);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

export default db;
