import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inventoryItems } from "@/lib/db/schema";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { sku, name, unit, price, stockQty, isActive } = body;
    const { id } = params;

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

    // Check if another item with this SKU exists (excluding current item)
    const existingItem = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.sku, sku))
      .limit(1);

    if (existingItem.length > 0 && existingItem[0].id !== id) {
      return NextResponse.json(
        { message: "Item with this SKU already exists" },
        { status: 409 },
      );
    }

    const updatedItem = await db
      .update(inventoryItems)
      .set({
        sku,
        name,
        unit,
        price: price.toString(),
        stockQty,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date(),
      })
      .where(eq(inventoryItems.id, id))
      .returning();

    if (updatedItem.length === 0) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(updatedItem[0]);
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return NextResponse.json(
      { message: "Failed to update inventory item" },
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

    const deletedItem = await db
      .delete(inventoryItems)
      .where(eq(inventoryItems.id, id))
      .returning();

    if (deletedItem.length === 0) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return NextResponse.json(
      { message: "Failed to delete inventory item" },
      { status: 500 },
    );
  }
}
