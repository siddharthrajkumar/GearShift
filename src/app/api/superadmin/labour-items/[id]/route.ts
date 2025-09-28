import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { labourItems } from "@/lib/db/schema";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { code, description, priceCents, isActive } = body;

    if (!code || !description || priceCents === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const updatedItem = await db
      .update(labourItems)
      .set({
        code,
        description,
        priceCents: Math.round(priceCents * 100), // Convert to cents
        isActive: isActive !== undefined ? isActive : true,
      })
      .where(eq(labourItems.id, id))
      .returning();

    if (updatedItem.length === 0) {
      return NextResponse.json(
        { message: "Labour item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedItem[0]);
  } catch (error) {
    console.error("Error updating labour item:", error);
    return NextResponse.json(
      { message: "Failed to update labour item" },
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

    const deletedItem = await db
      .delete(labourItems)
      .where(eq(labourItems.id, id))
      .returning();

    if (deletedItem.length === 0) {
      return NextResponse.json(
        { message: "Labour item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Labour item deleted successfully" });
  } catch (error) {
    console.error("Error deleting labour item:", error);
    return NextResponse.json(
      { message: "Failed to delete labour item" },
      { status: 500 },
    );
  }
}
