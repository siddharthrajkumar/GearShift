import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customers, vehicles } from "@/lib/db/schema";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { customerId, make, model, year, regNumber, vin } = body;
    const { id } = params;

    if (!customerId || !make || !model || !year || !regNumber) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if another vehicle with this registration number exists (excluding current vehicle)
    const existingVehicle = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.regNumber, regNumber))
      .limit(1);

    if (existingVehicle.length > 0 && existingVehicle[0].id !== id) {
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

    const updatedVehicle = await db
      .update(vehicles)
      .set({
        customerId,
        make,
        model,
        year,
        regNumber,
        vin: vin || null,
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, id))
      .returning();

    if (updatedVehicle.length === 0) {
      return NextResponse.json(
        { message: "Vehicle not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedVehicle[0]);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json(
      { message: "Failed to update vehicle" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const deletedVehicle = await db
      .delete(vehicles)
      .where(eq(vehicles.id, id))
      .returning();

    if (deletedVehicle.length === 0) {
      return NextResponse.json(
        { message: "Vehicle not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json(
      { message: "Failed to delete vehicle" },
      { status: 500 },
    );
  }
}
