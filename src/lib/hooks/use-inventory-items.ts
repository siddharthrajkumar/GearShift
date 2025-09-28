"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  unit: string;
  price: string;
  stockQty: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InventoryFormData {
  sku: string;
  name: string;
  unit: string;
  price: number;
  stockQty: number;
  isActive: boolean;
}

const INVENTORY_ITEMS_QUERY_KEY = ["inventory-items"] as const;

export function useInventoryItems() {
  return useQuery({
    queryKey: INVENTORY_ITEMS_QUERY_KEY,
    queryFn: async (): Promise<InventoryItem[]> => {
      const response = await fetch("/api/superadmin/inventory-items");
      if (!response.ok) {
        throw new Error("Failed to fetch inventory items");
      }
      return response.json();
    },
  });
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InventoryFormData): Promise<InventoryItem> => {
      const response = await fetch("/api/superadmin/inventory-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_ITEMS_QUERY_KEY });
      toast.success("Item created");
    },
    onError: (error) => {
      toast.error(error.message || "Error creating item");
    },
  });
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: InventoryFormData;
    }): Promise<InventoryItem> => {
      const response = await fetch(`/api/superadmin/inventory-items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_ITEMS_QUERY_KEY });
      toast.success("Item updated");
    },
    onError: (error) => {
      toast.error(error.message || "Error updating item");
    },
  });
}

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/superadmin/inventory-items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_ITEMS_QUERY_KEY });
      toast.success("Item deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Error deleting item");
    },
  });
}
