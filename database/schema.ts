import { relations } from "drizzle-orm";
import {
  decimal,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const PAYMENT_STATUS_ENUM = pgEnum("status", ["pending", "paid", "overdue"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  password: text("password"),
  businessName: text("business_name"),
  profilePic: text("profile_pic"),
  phone: text("phone").unique(),
  currency: varchar("currency").default("USD"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  companyName: varchar("company_name").notNull(),
  profilePic: text("profile_pic"),
  address: text("address"),
  phone: text("phone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // ✅ FIXED: Now correctly references `users.id`
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }), // ✅ Add a reference to `clients.id`
  invoiceNumber: serial("invoice_no").notNull().unique(),
  dueDate: timestamp("due_date").notNull().defaultNow(),
  status: PAYMENT_STATUS_ENUM("status").default("pending"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const userRelations = relations(users, ({ many }) => ({
  clients: many(clients),
}));

export const clientRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  invoices: many(invoices),
}));

export const invoiceRelations = relations(invoices, ({ one }) => ({
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
}));

export type CreateOrUpdateUser = typeof users.$inferInsert;
export type CreateOrUpdateClient = typeof clients.$inferInsert;
export type CreateOrUpdateInvoice = typeof invoices.$inferInsert;

export type GetUser = typeof users.$inferSelect;
export type GetClient = typeof clients.$inferSelect;
export type GetInvoice = typeof invoices.$inferSelect;
