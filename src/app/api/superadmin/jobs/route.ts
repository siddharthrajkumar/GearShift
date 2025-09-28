import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customers, job, users, vehicles } from "@/lib/db/schema";

export async function GET() {
  try {
    const allJobs = await db
      .select({
        id: job.id,
        customerId: job.customerId,
        customerName: customers.name,
        vehicleId: job.vehicleId,
        vehicleMake: vehicles.make,
        vehicleModel: vehicles.model,
        vehicleRegNumber: vehicles.regNumber,
        assignedMechanicId: job.assignedMechanicId,
        mechanicName: users.name,
        state: job.state,
        odoKm: job.odoKm,
        fuelLevel: job.fuelLevel,
        conditionMedia: job.conditionMedia,
        customerRequirements: job.customerRequirements,
        createdBy: job.createdBy,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      })
      .from(job)
      .leftJoin(customers, eq(job.customerId, customers.id))
      .leftJoin(vehicles, eq(job.vehicleId, vehicles.id))
      .leftJoin(users, eq(job.assignedMechanicId, users.id))
      .orderBy(job.createdAt);

    return NextResponse.json(allJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { message: "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      vehicleId,
      assignedMechanicId,
      state,
      odoKm,
      fuelLevel,
      customerRequirements,
      createdBy,
    } = body;

    if (!customerId || !vehicleId || !state || !createdBy) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const newJob = await db
      .insert(job)
      .values({
        id: createId(),
        customerId,
        vehicleId,
        assignedMechanicId: assignedMechanicId || null,
        state,
        odoKm: odoKm || null,
        fuelLevel: fuelLevel || null,
        customerRequirements: customerRequirements || null,
        createdBy,
      })
      .returning();

    return NextResponse.json(newJob[0], { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { message: "Failed to create job" },
      { status: 500 },
    );
  }
}
