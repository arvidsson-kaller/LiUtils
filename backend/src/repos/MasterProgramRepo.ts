import db from "./Database";
import DbMasterProgram, {
  MasterProgramId,
  DbMasterProgramInitializer,
} from "@src/models/MasterProgram";
import { StartYearId } from "@src/models/StartYear";
import logger from "jet-logger";
import { Pool, PoolClient } from "pg";

async function getAll(
  pool: Pool | PoolClient = db,
): Promise<DbMasterProgram[]> {
  const res = await pool.query('SELECT * from "MasterProgram"');
  return res.rows as DbMasterProgram[];
}

async function create(
  program: DbMasterProgramInitializer,
  pool: Pool | PoolClient = db,
): Promise<DbMasterProgram> {
  try {
    const sql = 'INSERT INTO "MasterProgram" ("name") VALUES ($1) RETURNING *';
    const data: string[] = [program.name];
    const result = await pool.query(sql, data);
    const createdMasterProgram: DbMasterProgram = result
      .rows[0] as DbMasterProgram;
    return createdMasterProgram;
  } catch (error) {
    logger.err(error);
    throw new Error("Failed to create Master Program");
  }
}

async function findById(
  masterProgramId: MasterProgramId,
  pool: Pool | PoolClient = db,
): Promise<DbMasterProgram> {
  const res = await pool.query(
    'SELECT * from "MasterProgram" where id = ($1)',
    [masterProgramId],
  );
  if (res.rows.length == 1) {
    return res.rows[0] as DbMasterProgram;
  }
  throw new Error("Not found");
}

async function deleteById(
  masterProgramId: MasterProgramId,
  pool: Pool | PoolClient = db,
): Promise<void> {
  await pool.query('DELETE from "MasterProgram" where id = ($1)', [
    masterProgramId,
  ]);
}

export interface ReducedStartYear {
  id: StartYearId;

  name: string;

  createdAt: Date;
}

async function getStartYearsById(
  masterProgramId: MasterProgramId,
  pool: Pool | PoolClient = db,
): Promise<ReducedStartYear[]> {
  const res = await pool.query(
    'SELECT "id", "name", "createdAt" from "StartYear" where "masterProgramId" = ($1)',
    [masterProgramId],
  );
  if (res.rows.length > 0) {
    return res.rows as ReducedStartYear[];
  }
  throw new Error("Not found");
}

export default {
  getAll,
  create,
  deleteById,
  findById,
  getStartYearsById,
} as const;
