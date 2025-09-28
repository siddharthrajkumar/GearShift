"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  customerId: string;
  customerName?: string;
  make: string;
  model: string;
  year: number;
  regNumber: string;
  vin: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Customer {
  id: string;
  name: string;
}

interface VehicleFormData {
  customerId: string;
  make: string;
  model: string;
  year: number;
  regNumber: string;
  vin: string | null;
}

const VEHICLES_QUERY_KEY = ["vehicles"] as const;
const CUSTOMERS_QUERY_KEY = ["customers"] as const;

export function useVehicles() {
  return useQuery({
    queryKey: VEHICLES_QUERY_KEY,
    queryFn: async (): Promise<Vehicle[]> => {
      const response = await fetch("/api/superadmin/vehicles");
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }
      return response.json();
    },
  });
}

export function useVehicleCustomers() {
  return useQuery({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: async (): Promise<Customer[]> => {
      const response = await fetch("/api/superadmin/customers");
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      return response.json();
    },
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VehicleFormData): Promise<Vehicle> => {
      const response = await fetch("/api/superadmin/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create vehicle");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
      toast.success("Vehicle created");
    },
    onError: (error) => {
      toast.error(error.message || "Error creating vehicle");
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: VehicleFormData;
    }): Promise<Vehicle> => {
      const response = await fetch(`/api/superadmin/vehicles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update vehicle");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
      toast.success("Vehicle updated");
    },
    onError: (error) => {
      toast.error(error.message || "Error updating vehicle");
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/superadmin/vehicles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete vehicle");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
      toast.success("Vehicle deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Error deleting vehicle");
    },
  });
}
