import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { job } from "@/lib/db/schema";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      customerId,
      vehicleId,
      assignedMechanicId,
      state,
      odoKm,
      fuelLevel,
      customerRequirements,
    } = body;

    if (!customerId || !vehicleId || !state) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const updatedJob = await db
      .update(job)
      .set({
        customerId,
        vehicleId,
        assignedMechanicId: assignedMechanicId || null,
        state,
        odoKm: odoKm || null,
        fuelLevel: fuelLevel || null,
        customerRequirements: customerRequirements || null,
        updatedAt: new Date(),
      })
      .where(eq(job.id, id))
      .returning();

    if (updatedJob.length === 0) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(updatedJob[0]);
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { message: "Failed to update job" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const deletedJob = await db.delete(job).where(eq(job.id, id)).returning();

    if (deletedJob.length === 0) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { message: "Failed to delete job" },
      { status: 500 },
    );
  }
}
