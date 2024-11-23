import { create } from "domain";
import { InferInsertModel, or, relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const organizationsTable = pgTable("organizations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updateAt: timestamp("updated_at").notNull().defaultNow(),
});

export const rolesTable = pgTable("roles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  namae: varchar("name").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updateAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 225 }).notNull().unique(),
  firstName: varchar({ length: 225 }).notNull(),
  lastName: varchar({ length: 225 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updateAt: timestamp("updated_at").notNull().defaultNow(),
  isActive: boolean().default(true),
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

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(usersTable, {
    fields: [userRoles.userId],
    references: [usersTable.id],
  }),
  organization: one(organizationsTable, {
    fields: [userRoles.organizationId],
    references: [organizationsTable.id],
  }),
  role: one(rolesTable, {
    fields: [userRoles.roleId],
    references: [rolesTable.id],
  }),
}));

export const authMethodsRelations = relations(authMethods, ({ one }) => ({
  user: one(usersTable, {
    fields: [authMethods.userId],
    references: [usersTable.id],
  }),
}));

export type User = InferInsertModel<typeof usersTable>;
export type Organization = InferInsertModel<typeof organizationsTable>;
export type Role = InferInsertModel<typeof rolesTable>;
