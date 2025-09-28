import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inventoryItems } from "@/lib/db/schema";

export async function GET() {
  try {
    const allItems = await db
      .select()
      .from(inventoryItems)
      .orderBy(inventoryItems.createdAt);
    return NextResponse.json(allItems);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return NextResponse.json(
      { message: "Failed to fetch inventory items" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sku, name, unit, price, stockQty, isActive } = body;

    if (
      !sku ||
      !name ||
      !unit ||
      price === undefined ||
      stockQty === undefined
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if item with this SKU already exists
    const existingItem = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.sku, sku))
      .limit(1);

    if (existingItem.length > 0) {
      return NextResponse.json(
        { message: "Item with this SKU already exists" },
        { status: 409 },
      );
    }

    const newItem = await db
      .insert(inventoryItems)
      .values({
        id: createId(),
        sku,
        name,
        unit,
        price: price.toString(),
        stockQty,
        isActive: isActive !== undefined ? isActive : true,
      })
      .returning();

    return NextResponse.json(newItem[0], { status: 201 });
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return NextResponse.json(
      { message: "Failed to create inventory item" },
      { status: 500 },
    );
  }
}
