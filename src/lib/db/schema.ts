import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  role: text("role", {
    enum: ["superadmin", "admin", "mechanic"],
  })
    .notNull()
    .default("mechanic"),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const customers = pgTable("customers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email").unique(),
  whatsappOptIn: boolean("whatsapp_opt_in").default(true),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const vehicles = pgTable("vehicles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  regNumber: text("reg_number").notNull().unique(),
  vin: text("vin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const job = pgTable("job", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id),
  vehicleId: text("vehicle_id")
    .notNull()
    .references(() => vehicles.id),
  assignedMechanicId: text("assigned_mechanic_id").references(() => users.id),
  state: text("state", {
    enum: [
      "VEHICLE_RECEIVED",
      "WAITING_FOR_ESTIMATE_APPROVAL",
      "ESTIMATE_APPROVED",
      "ESTIMATE_REJECTED",
      "IN_SERVICE",
      "QUALITY_CHECK",
      "BILLING",
      "READY_FOR_DELIVERY",
      "CLOSED",
    ],
  }).notNull(),
  odoKm: integer("odo_km"),
  fuelLevel: text("fuel_level", {
    enum: ["E", "1/4", "1/2", "3/4", "F"],
  }),
  conditionMedia: jsonb("condition_media"), // {photos: [keys], video: key}
  customerRequirements: text("customer_requirements"),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const inventoryItems = pgTable("inventory_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  unit: text("unit").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stockQty: integer("stock_qty").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const labourItems = pgTable("labour_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  priceCents: integer("price_cents").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const estimates = pgTable("estimates", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  jobCardId: text("job_card_id")
    .notNull()
    .references(() => job.id),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  subtotalCents: integer("subtotal_cents").notNull(),
  taxCents: integer("tax_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  status: text("status", {
    enum: ["PENDING", "APPROVED", "REJECTED"],
  })
    .default("PENDING")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const estimateLines = pgTable("estimate_lines", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  estimateId: text("estimate_id")
    .notNull()
    .references(() => estimates.id),
  kind: text("kind", {
    enum: ["INVENTORY", "LABOUR"],
  }).notNull(),
  refId: text("ref_id").notNull(), // inventory_items.id or labour_items.id
  name: text("name").notNull(), // snapshot
  qty: numeric("qty", { precision: 10, scale: 2 }).notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(), // snapshot
  totalCents: integer("total_cents").notNull(), // qty * unit_price
});

export const workLogs = pgTable("work_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  jobCardId: text("job_card_id")
    .notNull()
    .references(() => job.id),
  mechanicId: text("mechanic_id")
    .notNull()
    .references(() => users.id),
  note: text("note").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const partsUsage = pgTable("parts_usage", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  jobCardId: text("job_card_id")
    .notNull()
    .references(() => job.id),
  inventoryItemId: text("inventory_item_id")
    .notNull()
    .references(() => inventoryItems.id),
  qty: numeric("qty", { precision: 10, scale: 2 }).notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  addedBy: text("added_by")
    .notNull()
    .references(() => users.id),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const invoices = pgTable("invoices", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const orders = pgTable("orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  jobCardId: text("job_card_id")
    .notNull()
    .references(() => job.id),
  grossAmount: numeric("gross_amount", { precision: 10, scale: 2 }).notNull(),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status", {
    enum: ["PENDING", "PAID"],
  })
    .default("PENDING")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  pdfUrl: text("pdf_url"),
});

export const payments = pgTable("payments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  razorpayOrderId: text("razorpay_order_id"),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method", {
    enum: ["CASH", "RAZORPAY"],
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const notifications = pgTable("notifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  jobCardId: text("job_card_id").references(() => job.id),
  channel: text("channel", {
    enum: ["WHATSAPP"],
  }).notNull(),
  toPhone: text("to_phone").notNull(),
  template: text("template").notNull(),
  payload: jsonb("payload"),
  status: text("status", {
    enum: ["QUEUED", "SENT", "FAILED"],
  })
    .default("QUEUED")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const pdfTemplates = pgTable("pdf_templates", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  template: jsonb("template").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const accounts = pgTable("accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const verification = pgTable("verification", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
