import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

type AnyFn = (...args: any[]) => any;

let pool: any;
let db: any;

if (!process.env.DATABASE_URL) {
  const noopAsync = async () => [];
  const returningAsync = async () => [];
  const rowCountAsync = async () => ({ rowCount: 0 });

  db = {
    select: (() => ({
      from: (() => ({
        where: noopAsync,
        limit: (() => ({
          offset: noopAsync,
        })) as AnyFn,
        orderBy: (() => ({
          limit: (() => ({
            offset: noopAsync,
          })) as AnyFn,
        })) as AnyFn,
      })) as AnyFn,
      orderBy: (() => ({
        limit: (() => ({
          offset: noopAsync,
        })) as AnyFn,
      })) as AnyFn,
    })) as AnyFn,
    insert: (() => ({
      values: (() => ({
        onConflictDoUpdate: (() => ({
          returning: returningAsync,
        })) as AnyFn,
        returning: returningAsync,
      })) as AnyFn,
    })) as AnyFn,
    update: (() => ({
      set: (() => ({
        where: (() => ({
          returning: returningAsync,
        })) as AnyFn,
      })) as AnyFn,
    })) as AnyFn,
    delete: (() => ({
      where: rowCountAsync,
    })) as AnyFn,
  };
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { pool, db };
