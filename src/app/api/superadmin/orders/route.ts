import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customers, job, orders, vehicles } from "@/lib/db/schema";

export async function GET() {
  try {
    const allOrders = await db
      .select({
        id: orders.id,
        jobCardId: orders.jobCardId,
        grossAmount: orders.grossAmount,
        taxAmount: orders.taxAmount,
        totalAmount: orders.totalAmount,
        status: orders.status,
        pdfUrl: orders.pdfUrl,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        customerName: customers.name,
        vehicleMake: vehicles.make,
        vehicleModel: vehicles.model,
        vehicleRegNumber: vehicles.regNumber,
      })
      .from(orders)
      .leftJoin(job, eq(orders.jobCardId, job.id))
      .leftJoin(customers, eq(job.customerId, customers.id))
      .leftJoin(vehicles, eq(job.vehicleId, vehicles.id))
      .orderBy(orders.createdAt);

    return NextResponse.json(allOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
