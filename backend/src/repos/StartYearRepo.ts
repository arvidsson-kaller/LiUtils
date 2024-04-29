import db from "./Database";
import DbStartYear, {
  StartYearId,
  DbStartYearInitializer,
} from "@src/models/StartYear";
import { StartYear as StartYearData } from "common/dist/studieinfo";
import logger from "jet-logger";
import { Pool, PoolClient } from "pg";

async function create(
  year: DbStartYearInitializer,
  pool: Pool | PoolClient = db,
): Promise<DbStartYear> {
  try {
    const sql =
      'INSERT INTO "StartYear" ("name", "data", "masterProgramId") VALUES ($1, $2, $3) RETURNING *';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any[] = [year.name, year.data, year.masterProgramId];
    const result = await pool.query(sql, data);
    const createdStartYear: DbStartYear = result.rows[0] as DbStartYear;
    return createdStartYear;
  } catch (error) {
    logger.err(error);
    throw new Error("Failed to create Start Year");
  }
}

async function findById(
  startYearId: StartYearId,
  pool: Pool | PoolClient = db,
): Promise<StartYearData> {
  const res = await pool.query('SELECT data from "StartYear" where id = ($1)', [
    startYearId,
  ]);
  if (res.rows.length == 1) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return res.rows[0].data as StartYearData;
  }
  throw new Error("Not found");
}

export default {
  create,
  findById,
} as const;
