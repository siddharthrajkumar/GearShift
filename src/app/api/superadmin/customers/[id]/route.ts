import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const { name, phone, email, whatsappOptIn } = body;
    const { id } = await params;

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 },
      );
    }

    // Check if another customer with this email exists (excluding current customer)
    if (email) {
      const existingCustomer = await db
        .select()
        .from(customers)
        .where(eq(customers.email, email))
        .limit(1);

      if (existingCustomer.length > 0 && existingCustomer[0].id !== id) {
        return NextResponse.json(
          { message: "Customer with this email already exists" },
          { status: 409 },
        );
      }
    }

    const updatedCustomer = await db
      .update(customers)
      .set({
        name,
        phone: phone || null,
        email: email || null,
        whatsappOptIn: whatsappOptIn !== undefined ? whatsappOptIn : true,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, id))
      .returning();

    if (updatedCustomer.length === 0) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedCustomer[0]);
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { message: "Failed to update customer" },
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

    const deletedCustomer = await db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning();

    if (deletedCustomer.length === 0) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { message: "Failed to delete customer" },
      { status: 500 },
    );
  }
}
