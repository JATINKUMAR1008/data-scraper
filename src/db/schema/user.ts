import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { organizationsTable } from "./org";
import { rolesTable } from "./roles";
import { InferInsertModel } from "drizzle-orm";
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 225 }).notNull().unique(),
  firstName: varchar({ length: 225 }).notNull(),
  lastName: varchar({ length: 225 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updateAt: timestamp("updated_at").notNull().defaultNow(),
  isActive: boolean().default(true),
  isNew: boolean().default(true),
});

export const authMethods = pgTable("auth_methods", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  providerU_ID: varchar("provider_user_id"),
  provider: varchar("provider").notNull(),
  passwordHash: varchar("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updateAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userRoles = pgTable("user_roles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  organizationId: integer("organization_id")
    .notNull()
    .references(() => organizationsTable.id),
  roleId: integer("role_id")
    .notNull()
    .references(() => rolesTable.id),
  assignedAt: timestamp("assigned_at").notNull().defaultNow(),
});

export const UserBalance = pgTable("user_balance", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => usersTable.id),
  credits: integer().default(0),
});

export type User = InferInsertModel<typeof usersTable>;
