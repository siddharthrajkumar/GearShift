"use client";

import { Edit, Loader2, Package, Plus, Trash2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateInventoryItem,
  useDeleteInventoryItem,
  useInventoryItems,
  useUpdateInventoryItem,
} from "@/lib/hooks/use-inventory-items";

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
  price: string;
  stockQty: string;
  isActive: boolean;
}

export default function InventoryItemsPage() {
  const { data: items = [], isLoading: loading } = useInventoryItems();
  const createItem = useCreateInventoryItem();
  const updateItem = useUpdateInventoryItem();
  const deleteItem = useDeleteInventoryItem();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<InventoryFormData>({
    sku: "",
    name: "",
    unit: "",
    price: "",
    stockQty: "0",
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      sku: formData.sku,
      name: formData.name,
      unit: formData.unit,
      price: parseFloat(formData.price),
      stockQty: parseInt(formData.stockQty, 10),
      isActive: formData.isActive,
    };

    if (editingItem) {
      updateItem.mutate(
        { id: editingItem.id, data: payload },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingItem(null);
            setFormData({
              sku: "",
              name: "",
              unit: "",
              price: "",
              stockQty: "0",
              isActive: true,
            });
          },
        },
      );
    } else {
      createItem.mutate(payload, {
        onSuccess: () => {
          setDialogOpen(false);
          setFormData({
            sku: "",
            name: "",
            unit: "",
            price: "",
            stockQty: "0",
            isActive: true,
          });
        },
      });
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      sku: item.sku,
      name: item.name,
      unit: item.unit,
      price: item.price,
      stockQty: item.stockQty.toString(),
      isActive: item.isActive,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inventory item?"))
      return;
    deleteItem.mutate(id);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setFormData({
      sku: "",
      name: "",
      unit: "",
      price: "",
      stockQty: "0",
      isActive: true,
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
            <h1 className="text-3xl font-bold">Inventory Items</h1>
            <p className="text-muted-foreground">
              Manage parts, supplies, and inventory stock
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem
                      ? "Edit Inventory Item"
                      : "Add New Inventory Item"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingItem
                      ? "Update inventory item information."
                      : "Add a new part or supply to inventory."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      type="text"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit *</Label>
                    <Input
                      id="unit"
                      type="text"
                      placeholder="pcs, liters, kg, etc."
                      value={formData.unit}
                      onChange={(e) =>
                        setFormData({ ...formData, unit: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stockQty">Stock Quantity *</Label>
                    <Input
                      id="stockQty"
                      type="number"
                      min="0"
                      value={formData.stockQty}
                      onChange={(e) =>
                        setFormData({ ...formData, stockQty: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          isActive: checked === true,
                        })
                      }
                    />
                    <Label htmlFor="isActive">Active</Label>
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
                    disabled={createItem.isPending || updateItem.isPending}
                  >
                    {createItem.isPending || updateItem.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {editingItem ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Inventory Items</CardTitle>
            <CardDescription>
              {items.length} item{items.length !== 1 ? "s" : ""} in inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            per {item.unit}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.sku}</Badge>
                    </TableCell>
                    <TableCell>₹{parseFloat(item.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.stockQty > 0 ? "default" : "destructive"}
                      >
                        {item.stockQty} {item.unit}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
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
