import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customers, job, orders, payments, vehicles } from "@/lib/db/schema";

export async function GET() {
  try {
    const allPayments = await db
      .select({
        id: payments.id,
        orderId: payments.orderId,
        razorpayOrderId: payments.razorpayOrderId,
        amount: payments.amount,
        paymentMethod: payments.paymentMethod,
        createdAt: payments.createdAt,
        updatedAt: payments.updatedAt,
        customerName: customers.name,
        vehicleMake: vehicles.make,
        vehicleModel: vehicles.model,
        vehicleRegNumber: vehicles.regNumber,
        orderTotalAmount: orders.totalAmount,
      })
      .from(payments)
      .leftJoin(orders, eq(payments.orderId, orders.id))
      .leftJoin(job, eq(orders.jobCardId, job.id))
      .leftJoin(customers, eq(job.customerId, customers.id))
      .leftJoin(vehicles, eq(job.vehicleId, vehicles.id))
      .orderBy(payments.createdAt);

    return NextResponse.json(allPayments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { message: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}
