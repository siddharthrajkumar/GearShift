import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customers, vehicles } from "@/lib/db/schema";

export async function GET() {
  try {
    const allVehicles = await db
      .select({
        id: vehicles.id,
        customerId: vehicles.customerId,
        customerName: customers.name,
        make: vehicles.make,
        model: vehicles.model,
        year: vehicles.year,
        regNumber: vehicles.regNumber,
        vin: vehicles.vin,
        createdAt: vehicles.createdAt,
        updatedAt: vehicles.updatedAt,
      })
      .from(vehicles)
      .leftJoin(customers, eq(vehicles.customerId, customers.id))
      .orderBy(vehicles.createdAt);

    return NextResponse.json(allVehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { message: "Failed to fetch vehicles" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, make, model, year, regNumber, vin } = body;

    if (!customerId || !make || !model || !year || !regNumber) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if vehicle with this registration number already exists
    const existingVehicle = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.regNumber, regNumber))
      .limit(1);

    if (existingVehicle.length > 0) {
      return NextResponse.json(
        { message: "Vehicle with this registration number already exists" },
        { status: 409 },
      );
    }

    // Check if customer exists
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);

    if (customer.length === 0) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 },
      );
    }

    const newVehicle = await db
      .insert(vehicles)
      .values({
        id: createId(),
        customerId,
        make,
        model,
        year,
        regNumber,
        vin: vin || null,
      })
      .returning();

    return NextResponse.json(newVehicle[0], { status: 201 });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return NextResponse.json(
      { message: "Failed to create vehicle" },
      { status: 500 },
    );
  }
}
