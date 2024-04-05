import { Pool } from "pg";
import EnvVars from "@src/constants/EnvVars";

const db = new Pool({
  connectionString: EnvVars.PostgreConnectionString,
});

export default db;
