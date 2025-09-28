"use client";

import { Clipboard, Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { useCustomers } from "@/lib/hooks/use-customers";
import {
  useCreateJob,
  useDeleteJob,
  useJobs,
  useUpdateJob,
} from "@/lib/hooks/use-jobs";
import { useUsers } from "@/lib/hooks/use-users";
import { useVehicles } from "@/lib/hooks/use-vehicles";

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
  assignedMechanicId: string;
  state: string;
  odoKm: string;
  fuelLevel: string;
  customerRequirements: string;
}

const JOB_STATES = [
  "VEHICLE_RECEIVED",
  "WAITING_FOR_ESTIMATE_APPROVAL",
  "ESTIMATE_APPROVED",
  "ESTIMATE_REJECTED",
  "IN_SERVICE",
  "QUALITY_CHECK",
  "BILLING",
  "READY_FOR_DELIVERY",
  "CLOSED",
];

const FUEL_LEVELS = ["E", "1/4", "1/2", "3/4", "F"];

export default function JobsPage() {
  const { data: jobs = [], isLoading: loading } = useJobs();
  const { data: customers = [] } = useCustomers();
  const { data: vehicles = [] } = useVehicles();
  const { data: users = [] } = useUsers();
  const { data: session } = authClient.useSession();

  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<JobFormData>({
    customerId: "",
    vehicleId: "",
    assignedMechanicId: "",
    state: "VEHICLE_RECEIVED",
    odoKm: "",
    fuelLevel: "",
    customerRequirements: "",
  });

  const mechanics = users.filter((user) => user.role === "mechanic");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      customerId: formData.customerId,
      vehicleId: formData.vehicleId,
      assignedMechanicId: formData.assignedMechanicId || undefined,
      state: formData.state,
      odoKm: formData.odoKm ? parseInt(formData.odoKm, 10) : undefined,
      fuelLevel: formData.fuelLevel || undefined,
      customerRequirements: formData.customerRequirements || undefined,
      createdBy: session?.user?.id || "",
    };

    if (editingJob) {
      updateJob.mutate(
        { id: editingJob.id, data: payload },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingJob(null);
            resetForm();
          },
        },
      );
    } else {
      createJob.mutate(payload, {
        onSuccess: () => {
          setDialogOpen(false);
          resetForm();
        },
      });
    }
  };

  const resetForm = () => {
    setFormData({
      customerId: "",
      vehicleId: "",
      assignedMechanicId: "",
      state: "VEHICLE_RECEIVED",
      odoKm: "",
      fuelLevel: "",
      customerRequirements: "",
    });
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      customerId: job.customerId,
      vehicleId: job.vehicleId,
      assignedMechanicId: job.assignedMechanicId || "",
      state: job.state,
      odoKm: job.odoKm?.toString() || "",
      fuelLevel: job.fuelLevel || "",
      customerRequirements: job.customerRequirements || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    deleteJob.mutate(id);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingJob(null);
    resetForm();
  };

  const getStateColor = (state: string) => {
    const stateColors: Record<string, string> = {
      VEHICLE_RECEIVED: "bg-blue-100 text-blue-800",
      WAITING_FOR_ESTIMATE_APPROVAL: "bg-yellow-100 text-yellow-800",
      ESTIMATE_APPROVED: "bg-green-100 text-green-800",
      ESTIMATE_REJECTED: "bg-red-100 text-red-800",
      IN_SERVICE: "bg-purple-100 text-purple-800",
      QUALITY_CHECK: "bg-orange-100 text-orange-800",
      BILLING: "bg-indigo-100 text-indigo-800",
      READY_FOR_DELIVERY: "bg-teal-100 text-teal-800",
      CLOSED: "bg-gray-100 text-gray-800",
    };
    return stateColors[state] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Jobs</h1>
            <p className="text-muted-foreground">
              Manage job cards and service orders
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Job
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingJob ? "Edit Job" : "Create New Job"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingJob
                      ? "Update job information."
                      : "Create a new service job card."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="customerId">Customer *</Label>
                      <Select
                        value={formData.customerId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, customerId: value })
                        }
                      >
                        <SelectTrigger id="customerId">
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="vehicleId">Vehicle *</Label>
                      <Select
                        value={formData.vehicleId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, vehicleId: value })
                        }
                      >
                        <SelectTrigger id="vehicleId">
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.make} {vehicle.model} -{" "}
                              {vehicle.regNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="state">Status *</Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) =>
                          setFormData({ ...formData, state: value })
                        }
                      >
                        <SelectTrigger id="state">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {JOB_STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="assignedMechanicId">
                        Assigned Mechanic
                      </Label>
                      <Select
                        value={formData.assignedMechanicId}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            assignedMechanicId: value,
                          })
                        }
                      >
                        <SelectTrigger id="assignedMechanicId">
                          <SelectValue placeholder="Select mechanic" />
                        </SelectTrigger>
                        <SelectContent>
                          {mechanics.map((mechanic) => (
                            <SelectItem key={mechanic.id} value={mechanic.id}>
                              {mechanic.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="odoKm">Odometer (KM)</Label>
                      <Input
                        id="odoKm"
                        type="number"
                        min="0"
                        value={formData.odoKm}
                        onChange={(e) =>
                          setFormData({ ...formData, odoKm: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fuelLevel">Fuel Level</Label>
                      <Select
                        value={formData.fuelLevel}
                        onValueChange={(value) =>
                          setFormData({ ...formData, fuelLevel: value })
                        }
                      >
                        <SelectTrigger id="fuelLevel">
                          <SelectValue placeholder="Select fuel level" />
                        </SelectTrigger>
                        <SelectContent>
                          {FUEL_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="customerRequirements">
                      Customer Requirements
                    </Label>
                    <Textarea
                      id="customerRequirements"
                      placeholder="Describe the customer's requirements..."
                      value={formData.customerRequirements}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerRequirements: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createJob.isPending || updateJob.isPending}
                  >
                    {createJob.isPending || updateJob.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {editingJob ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Jobs</CardTitle>
            <CardDescription>
              {jobs.length} job{jobs.length !== 1 ? "s" : ""} in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Mechanic</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clipboard className="h-4 w-4 text-muted-foreground" />
                        <div className="font-mono text-sm">
                          {job.id.slice(-8)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{job.customerName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {job.vehicleMake} {job.vehicleModel}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {job.vehicleRegNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {job.mechanicName ? (
                        <Badge variant="outline">{job.mechanicName}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Unassigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStateColor(job.state)}>
                        {job.state.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(job)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(job.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
