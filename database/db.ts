import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const url = process.env.DATABASE_URL!;
console.log(`DATABASE URL: ${url}`);
const sql = neon(url);
export const db = drizzle(sql, { schema });
