"use client";

import { Car, Edit, Loader2, Plus, Trash2 } from "lucide-react";
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
import {
  useCreateVehicle,
  useDeleteVehicle,
  useUpdateVehicle,
  useVehicleCustomers,
  useVehicles,
} from "@/lib/hooks/use-vehicles";

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

interface VehicleFormData {
  customerId: string;
  make: string;
  model: string;
  year: string;
  regNumber: string;
  vin: string;
}

export default function VehiclesPage() {
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehicles();
  const { data: customers = [], isLoading: customersLoading } =
    useVehicleCustomers();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();

  const loading = vehiclesLoading || customersLoading;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<VehicleFormData>({
    customerId: "",
    make: "",
    model: "",
    year: "",
    regNumber: "",
    vin: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      customerId: formData.customerId,
      make: formData.make,
      model: formData.model,
      year: parseInt(formData.year, 10),
      regNumber: formData.regNumber,
      vin: formData.vin || null,
    };

    if (editingVehicle) {
      updateVehicle.mutate(
        { id: editingVehicle.id, data: payload },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingVehicle(null);
            setFormData({
              customerId: "",
              make: "",
              model: "",
              year: "",
              regNumber: "",
              vin: "",
            });
          },
        },
      );
    } else {
      createVehicle.mutate(payload, {
        onSuccess: () => {
          setDialogOpen(false);
          setFormData({
            customerId: "",
            make: "",
            model: "",
            year: "",
            regNumber: "",
            vin: "",
          });
        },
      });
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      customerId: vehicle.customerId,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year.toString(),
      regNumber: vehicle.regNumber,
      vin: vehicle.vin || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    deleteVehicle.mutate(id);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingVehicle(null);
    setFormData({
      customerId: "",
      make: "",
      model: "",
      year: "",
      regNumber: "",
      vin: "",
    });
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
            <h1 className="text-3xl font-bold">Vehicles</h1>
            <p className="text-muted-foreground">
              Manage vehicle registry and specifications
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingVehicle
                      ? "Update vehicle information."
                      : "Register a new vehicle in the system."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="customer">Customer *</Label>
                    <Select
                      value={formData.customerId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, customerId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
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
                    <Label htmlFor="make">Make *</Label>
                    <Input
                      id="make"
                      type="text"
                      value={formData.make}
                      onChange={(e) =>
                        setFormData({ ...formData, make: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      type="text"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1900"
                      max="2030"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="regNumber">Registration Number *</Label>
                    <Input
                      id="regNumber"
                      type="text"
                      value={formData.regNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, regNumber: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="vin">VIN</Label>
                    <Input
                      id="vin"
                      type="text"
                      value={formData.vin}
                      onChange={(e) =>
                        setFormData({ ...formData, vin: e.target.value })
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
                    disabled={
                      createVehicle.isPending || updateVehicle.isPending
                    }
                  >
                    {createVehicle.isPending || updateVehicle.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {editingVehicle ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Vehicles</CardTitle>
            <CardDescription>
              {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}{" "}
              registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>VIN</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {vehicle.year}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{vehicle.customerName || "Unknown"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{vehicle.regNumber}</Badge>
                    </TableCell>
                    <TableCell>
                      {vehicle.vin || (
                        <span className="text-muted-foreground">
                          Not provided
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(vehicle.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(vehicle)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(vehicle.id)}
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
