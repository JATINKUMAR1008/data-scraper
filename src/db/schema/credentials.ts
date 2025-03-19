import { InferInsertModel } from "drizzle-orm";
import { 
  integer, 
  pgTable, 
  text, 
  timestamp, 
  uniqueIndex 
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const credentialsTable = pgTable("credentials", 
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().references(() => usersTable.id).notNull(),
    name: text().notNull(),
    value: text().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    nameIndex: uniqueIndex("credentials_name_idx").on(table.name),
  })
);

export type Credentials = InferInsertModel<typeof credentialsTable>;