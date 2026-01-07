import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { keys } from "./keys";
import * as schema from "./schema";

const client = postgres(keys().DATABASE_URL);

export const database = drizzle(client, { schema });

export * from "drizzle-orm";
export * from "./schema";
