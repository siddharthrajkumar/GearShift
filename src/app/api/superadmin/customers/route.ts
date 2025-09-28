import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";

export async function GET() {
  try {
    const allCustomers = await db
      .select()
      .from(customers)
      .orderBy(customers.createdAt);
    return NextResponse.json(allCustomers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { message: "Failed to fetch customers" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, whatsappOptIn } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 },
      );
    }

    // Check if customer with this email already exists (if email provided)
    if (email) {
      const existingCustomer = await db
        .select()
        .from(customers)
        .where(eq(customers.email, email))
        .limit(1);

      if (existingCustomer.length > 0) {
        return NextResponse.json(
          { message: "Customer with this email already exists" },
          { status: 409 },
        );
      }
    }

    // For now, we'll use a placeholder createdBy. In a real app, this would come from the authenticated user
    const createdBy = "placeholder-user-id";

    const newCustomer = await db
      .insert(customers)
      .values({
        id: createId(),
        name,
        phone: phone || null,
        email: email || null,
        whatsappOptIn: whatsappOptIn !== undefined ? whatsappOptIn : true,
        createdBy,
      })
      .returning();

    return NextResponse.json(newCustomer[0], { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { message: "Failed to create customer" },
      { status: 500 },
    );
  }
}
