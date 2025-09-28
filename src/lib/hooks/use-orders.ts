"use client";

import { useQuery } from "@tanstack/react-query";

interface Order {
  id: string;
  jobCardId: string;
  grossAmount: string;
  taxAmount: string;
  totalAmount: string;
  status: string;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
  customerName: string | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleRegNumber: string | null;
}

const ORDERS_QUERY_KEY = ["orders"] as const;

export function useOrders() {
  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: async (): Promise<Order[]> => {
      const response = await fetch("/api/superadmin/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      return response.json();
    },
  });
}
