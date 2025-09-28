import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { labourItems } from "@/lib/db/schema";

export async function GET() {
  try {
    const allItems = await db
      .select()
      .from(labourItems)
      .orderBy(labourItems.code);
    return NextResponse.json(allItems);
  } catch (error) {
    console.error("Error fetching labour items:", error);
    return NextResponse.json(
      { message: "Failed to fetch labour items" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, description, priceCents, isActive } = body;

    if (!code || !description || priceCents === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if item with this code already exists
    const existingItem = await db
      .select()
      .from(labourItems)
      .where(eq(labourItems.code, code))
      .limit(1);

    if (existingItem.length > 0) {
      return NextResponse.json(
        { message: "Item with this code already exists" },
        { status: 409 },
      );
    }

    const newItem = await db
      .insert(labourItems)
      .values({
        id: createId(),
        code,
        description,
        priceCents: Math.round(priceCents * 100), // Convert to cents
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    return NextResponse.json(newItem[0], { status: 201 });
  } catch (error) {
    console.error("Error creating labour item:", error);
    return NextResponse.json(
      { message: "Failed to create labour item" },
      { status: 500 },
    );
  }
}
