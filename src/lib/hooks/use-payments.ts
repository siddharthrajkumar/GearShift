"use client";

import { useQuery } from "@tanstack/react-query";

interface Payment {
  id: string;
  orderId: string;
  razorpayOrderId: string | null;
  amount: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  customerName: string | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleRegNumber: string | null;
  orderTotalAmount: string | null;
}

const PAYMENTS_QUERY_KEY = ["payments"] as const;

export function usePayments() {
  return useQuery({
    queryKey: PAYMENTS_QUERY_KEY,
    queryFn: async (): Promise<Payment[]> => {
      const response = await fetch("/api/superadmin/payments");
      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }
      return response.json();
    },
  });
}
