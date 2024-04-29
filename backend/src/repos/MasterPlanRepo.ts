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

async function getAll(): Promise<DbMasterPlanWithUser[]> {
  const res = await db.query({
    text: 'SELECT m.*, u.* from "MasterPlan" m, "User" u where m."userId" = u.id',
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

async function findById(id: MasterPlanId): Promise<DbMasterPlan> {
  const res = await db.query('SELECT * FROM "MasterPlan" WHERE id = ($1)', [
    id,
  ]);
  if (res.rows.length == 1) {
    return res.rows[0] as DbMasterPlan;
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
