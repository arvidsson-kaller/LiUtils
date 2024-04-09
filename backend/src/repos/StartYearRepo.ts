import db from "./Database";
import StartYear, {
  StartYearId,
  StartYearInitializer,
} from "@src/models/StartYear";
import logger from "jet-logger";
import { Pool, PoolClient } from "pg";

async function create(
  year: StartYearInitializer,
  pool: Pool | PoolClient = db,
): Promise<StartYear> {
  try {
    const sql =
      'INSERT INTO "StartYear" ("name", "data", "masterProgramId") VALUES ($1, $2, $3) RETURNING *';
    const data: any[] = [year.name, year.data, year.masterProgramId];
    const result = await pool.query(sql, data);
    const createdStartYear: StartYear = result.rows[0] as StartYear;
    return createdStartYear;
  } catch (error) {
    logger.err(error);
    throw new Error("Failed to create Start Year");
  }
}

async function findById(
  startYearId: StartYearId,
  pool: Pool | PoolClient = db,
): Promise<StartYear> {
  const res = await pool.query('SELECT * from "StartYear" where id = ($1)', [
    startYearId,
  ]);
  if (res.rows.length == 1) {
    return res.rows[0] as StartYear;
  }
  throw new Error("Not found");
}

export default {
  create,
  findById,
} as const;
