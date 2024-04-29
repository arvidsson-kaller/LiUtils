import { FieldDef, Pool, PoolClient, QueryArrayResult } from "pg";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function seperateObjectsFromArray(fields: FieldDef[], row: any[]): any[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const objects: any[] = [];
  let currentTable = fields[0].tableID;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentObject: any = {};
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    // eslint-disable-next-line
    const result: any = row[i];
    if (currentTable !== field.tableID) {
      objects.push(currentObject);
      currentObject = {};
      currentTable = field.tableID;
    }
    // eslint-disable-next-line
    currentObject[field.name] = result;
  }
  objects.push(currentObject);
  return objects;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const splitQueryResultByTable = (res: QueryArrayResult): any[][] => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.rows.map((row) => seperateObjectsFromArray(res.fields, row));
};

export default db;
