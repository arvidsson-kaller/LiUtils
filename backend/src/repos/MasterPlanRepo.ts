import db, { splitQueryResultByTable } from "./Database";
import logger from "jet-logger";
import DbMasterPlan, {
  DbMasterPlanInitializer,
  MasterPlanId,
} from "@src/models/MasterPlan";
import DbUser, { UserId } from "@src/models/User";
import { QueryArrayResult } from "pg";

export interface DbMasterPlanWithUser extends DbMasterPlan {
  user: DbUser;
}
function mapResult(res: QueryArrayResult): DbMasterPlanWithUser[] {
  // eslint-disable-next-line  @typescript-eslint/no-unsafe-return
  const rows = splitQueryResultByTable(res).map((rowObjects) => ({
    ...rowObjects[0],
    user: rowObjects[1], // eslint-disable-line
  }));
  return rows as DbMasterPlanWithUser[];
}

async function getAll(
  program: string | undefined,
  year: string | undefined,
  specializion: string | undefined,
): Promise<DbMasterPlanWithUser[]> {
  let query =
    'SELECT m.*, u.* from "MasterPlan" m, "User" u WHERE m."userId" = u.id';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values: any[] = [];
  if (program) {
    values.push(program);
    query += " AND m.data->>'programName'=($" + values.length + ")";
  }
  if (year) {
    values.push(year);
    query += " AND m.data->>'startyear'=($" + values.length + ")";
  }
  if (specializion) {
    values.push(specializion);
    query += " AND m.data->>'specializion'=($" + values.length + ")";
  }

  const res = await db.query({
    text: query,
    values: values,
    rowMode: "array",
  });
  return mapResult(res);
}

async function getAllByUserId(userId: UserId): Promise<DbMasterPlanWithUser[]> {
  const res = await db.query({
    text: 'SELECT m.*, u.* from "MasterPlan" m, "User" u WHERE m."userId" = u.id AND m."userId"=($1)',
    values: [userId],
    rowMode: "array",
  });
  return mapResult(res);
}

async function findById(id: MasterPlanId): Promise<DbMasterPlanWithUser> {
  const query =
    'SELECT m.*, u.* from "MasterPlan" m, "User" u WHERE m."userId" = u.id AND m.id=($1)';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values: any[] = [id];
  const res = await db.query({
    text: query,
    values: values,
    rowMode: "array",
  });
  const rows = mapResult(res);
  if (rows.length === 1) {
    return rows[0];
  }
  throw new Error("Not found");
}

async function update(plan: DbMasterPlan): Promise<DbMasterPlan> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = [plan.title, plan.data, plan.id, plan.userId];
  const res = await db.query(
    'UPDATE "MasterPlan" SET title=($1), data=($2) WHERE id=($3) AND "userId"=($4)  RETURNING *',
    data,
  );
  if (res.rows.length == 1) {
    return res.rows[0] as DbMasterPlan;
  }
  throw new Error("Not found");
}

async function create(plan: DbMasterPlanInitializer): Promise<DbMasterPlan> {
  try {
    const sql =
      'INSERT INTO "MasterPlan" (title, data, "userId") VALUES ($1, $2, $3) RETURNING *';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any[] = [plan.title, plan.data, plan.userId];
    const result = await db.query(sql, data);
    const createdPlan = result.rows[0] as DbMasterPlan;
    return createdPlan;
  } catch (error) {
    logger.err(error);
    throw new Error("Failed to create user");
  }
}

export default {
  getAll,
  findById,
  create,
  update,
  getAllByUserId,
} as const;
