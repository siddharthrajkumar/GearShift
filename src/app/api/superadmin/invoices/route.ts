import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customers, invoices, job, orders, vehicles } from "@/lib/db/schema";

export async function GET() {
  try {
    const allInvoices = await db
      .select({
        id: invoices.id,
        orderId: invoices.orderId,
        amount: invoices.amount,
        createdAt: invoices.createdAt,
        updatedAt: invoices.updatedAt,
        customerName: customers.name,
        vehicleMake: vehicles.make,
        vehicleModel: vehicles.model,
        vehicleRegNumber: vehicles.regNumber,
        orderStatus: orders.status,
        orderTotalAmount: orders.totalAmount,
      })
      .from(invoices)
      .leftJoin(orders, eq(invoices.orderId, orders.id))
      .leftJoin(job, eq(orders.jobCardId, job.id))
      .leftJoin(customers, eq(job.customerId, customers.id))
      .leftJoin(vehicles, eq(job.vehicleId, vehicles.id))
      .orderBy(invoices.createdAt);

    return NextResponse.json(allInvoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { message: "Failed to fetch invoices" },
      { status: 500 },
    );
  }
}
