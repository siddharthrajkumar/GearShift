"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface LabourItem {
  id: string;
  code: string;
  description: string;
  priceCents: number;
  isActive: boolean;
}

interface LabourFormData {
  code: string;
  description: string;
  priceCents: number;
  isActive: boolean;
}

const LABOUR_ITEMS_QUERY_KEY = ["labour-items"] as const;

export function useLabourItems() {
  return useQuery({
    queryKey: LABOUR_ITEMS_QUERY_KEY,
    queryFn: async (): Promise<LabourItem[]> => {
      const response = await fetch("/api/superadmin/labour-items");
      if (!response.ok) {
        throw new Error("Failed to fetch labour items");
      }
      return response.json();
    },
  });
}

export function useCreateLabourItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LabourFormData): Promise<LabourItem> => {
      const response = await fetch("/api/superadmin/labour-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create labour item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABOUR_ITEMS_QUERY_KEY });
      toast.success("Labour item created");
    },
    onError: (error) => {
      toast.error(error.message || "Error creating labour item");
    },
  });
}

export function useUpdateLabourItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: LabourFormData;
    }): Promise<LabourItem> => {
      const response = await fetch(`/api/superadmin/labour-items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update labour item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABOUR_ITEMS_QUERY_KEY });
      toast.success("Labour item updated");
    },
    onError: (error) => {
      toast.error(error.message || "Error updating labour item");
    },
  });
}

export function useDeleteLabourItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/superadmin/labour-items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete labour item");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABOUR_ITEMS_QUERY_KEY });
      toast.success("Labour item deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Error deleting labour item");
    },
  });
}
