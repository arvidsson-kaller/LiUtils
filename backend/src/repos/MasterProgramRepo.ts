import db from "./Database";
import MasterProgram, {
  MasterProgramId,
  MasterProgramInitializer,
} from "@src/models/MasterProgram";
import { StartYearId } from "@src/models/StartYear";
import logger from "jet-logger";

async function getAll(): Promise<MasterProgram[]> {
  const res = await db.query('SELECT * from "MasterProgram"');
  return res.rows as MasterProgram[];
}

async function create(
  program: MasterProgramInitializer,
): Promise<MasterProgram> {
  try {
    const sql = 'INSERT INTO "MasterProgram" ("name") VALUES ($1) RETURNING *';
    const data: string[] = [program.name];
    const result = await db.query(sql, data);
    const createdMasterProgram: MasterProgram = result.rows[0] as MasterProgram;
    return createdMasterProgram;
  } catch (error) {
    logger.err(error);
    throw new Error("Failed to create Master Program");
  }
}

async function findById(
  masterProgramId: MasterProgramId,
): Promise<MasterProgram> {
  const res = await db.query('SELECT * from "MasterProgram" where id = ($1)', [
    masterProgramId,
  ]);
  if (res.rows.length == 1) {
    return res.rows[0] as MasterProgram;
  }
  throw new Error("Not found");
}

export interface StartYear {
  id: StartYearId;

  name: string;

  createdAt: Date;
}

async function getStartYearsById(
  masterProgramId: MasterProgramId,
): Promise<StartYear[]> {
  const res = await db.query(
    'SELECT * from "StartYear" where masterProgramId = ($1)',
    [masterProgramId],
  );
  if (res.rows.length > 0) {
    return res.rows as StartYear[];
  }
  throw new Error("Not found");
}

export default {
  getAll,
  create,
  findById,
  getStartYearsById,
} as const;
