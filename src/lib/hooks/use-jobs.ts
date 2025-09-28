"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Job {
  id: string;
  customerId: string;
  customerName: string | null;
  vehicleId: string;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleRegNumber: string | null;
  assignedMechanicId: string | null;
  mechanicName: string | null;
  state: string;
  odoKm: number | null;
  fuelLevel: string | null;
  conditionMedia: unknown;
  customerRequirements: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface JobFormData {
  customerId: string;
  vehicleId: string;
  assignedMechanicId?: string;
  state: string;
  odoKm?: number;
  fuelLevel?: string;
  customerRequirements?: string;
  createdBy: string;
}

const JOBS_QUERY_KEY = ["jobs"] as const;

export function useJobs() {
  return useQuery({
    queryKey: JOBS_QUERY_KEY,
    queryFn: async (): Promise<Job[]> => {
      const response = await fetch("/api/superadmin/jobs");
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      return response.json();
    },
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: JobFormData): Promise<Job> => {
      const response = await fetch("/api/superadmin/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create job");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
      toast.success("Job created");
    },
    onError: (error) => {
      toast.error(error.message || "Error creating job");
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Omit<JobFormData, "createdBy">;
    }): Promise<Job> => {
      const response = await fetch(`/api/superadmin/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update job");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
      toast.success("Job updated");
    },
    onError: (error) => {
      toast.error(error.message || "Error updating job");
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/superadmin/jobs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
      toast.success("Job deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Error deleting job");
    },
  });
}
