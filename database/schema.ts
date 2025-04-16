import { relations } from "drizzle-orm";
import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const usersBusiness = pgTable("user_business", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  doorNo: text("door_no"),
  street: text("street"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  zipcode: text("zipcode"),
  businessName: text("business_name"),
  profilePic: text("profile_pic"),
  phone: text("phone").unique(),
  currency: varchar("currency").default("USD"),
  businessUrl: text("businessUrl"),
  businessLogo: text("business_logo"),
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
  invoiceNumber: integer("invoice_no").notNull().unique(),
  dueDate: timestamp("due_date").notNull().defaultNow(),
  status: PAYMENT_STATUS_ENUM("status").default("pending"),
  taxPercentage: decimal("tax_percentage", { precision: 10, scale: 2 }),
  tax_amount: decimal("tax_amount", { precision: 10, scale: 2 }),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  invoiceTemplateId: integer("invoice_template_id").default(1),
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

export const invoiceDetails = pgTable("invoice_details", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity").default(0),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  subTotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export const invoceDetailsRelations = relations(invoiceDetails, ({ one }) => ({
  invoices: one(invoices, {
    fields: [invoiceDetails.invoiceId],
    references: [invoices.id],
  }),
}));

export const userRelations = relations(users, ({ many, one }) => ({
  clients: many(clients),
  usersBusiness: one(usersBusiness),
}));

export const usersBusinessRelations = relations(usersBusiness, ({ one }) => ({
  user: one(users, {
    fields: [usersBusiness.userId],
    references: [users.id],
  }),
}));

export const clientRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  invoices: many(invoices),
}));

export const invoiceRelations = relations(invoices, ({ one, many }) => ({
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
  invoiceItems: many(invoiceDetails),
}));

export type CreateOrUpdateUser = typeof users.$inferInsert;
export type CreateOrUpdateClient = typeof clients.$inferInsert;
export type CreateOrUpdateInvoice = typeof invoices.$inferInsert;
export type CreateOrUpdateInvoiceItems = typeof invoiceDetails.$inferInsert;
export type CreateOrUpdateUserBusiness = typeof usersBusiness.$inferInsert;

export type GetUser = typeof users.$inferSelect;
export type GetClient = typeof clients.$inferSelect;
export type GetInvoice = typeof invoices.$inferSelect;
export type GetUserBusiness = typeof usersBusiness.$inferSelect;
export type GetInvoiceItems = typeof invoiceDetails.$inferSelect;
