"use client";

import { useQuery } from "@tanstack/react-query";

interface Invoice {
  id: string;
  orderId: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
  customerName: string | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleRegNumber: string | null;
  orderStatus: string | null;
  orderTotalAmount: string | null;
}

const INVOICES_QUERY_KEY = ["invoices"] as const;

export function useInvoices() {
  return useQuery({
    queryKey: INVOICES_QUERY_KEY,
    queryFn: async (): Promise<Invoice[]> => {
      const response = await fetch("/api/superadmin/invoices");
      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }
      return response.json();
    },
  });
}
