import "./envConfig";
import { drizzle } from "drizzle-orm/node-postgres";
import { User, usersTable } from "./schema";
export const db = drizzle(process.env.DATABASE_URL!);

export const insertUser = async (user: User) => {
  return db.insert(usersTable).values(user).execute();
};
