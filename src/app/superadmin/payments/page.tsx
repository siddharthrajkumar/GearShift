"use client";

import { CreditCard, Loader2, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePayments } from "@/lib/hooks/use-payments";

export default function PaymentsPage() {
  const { data: payments = [], isLoading: loading } = usePayments();

  const getMethodColor = (method: string) => {
    const methodColors: Record<string, string> = {
      CASH: "bg-green-100 text-green-800",
      RAZORPAY: "bg-blue-100 text-blue-800",
    };
    return methodColors[method] || "bg-gray-100 text-gray-800";
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "CASH":
        return <Wallet className="h-4 w-4" />;
      case "RAZORPAY":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
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
            <h1 className="text-3xl font-bold">Payments</h1>
            <p className="text-muted-foreground">
              View payment transactions and history
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Payments
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cash Payments
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {payments.filter((p) => p.paymentMethod === "CASH").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Online Payments
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {payments.filter((p) => p.paymentMethod === "RAZORPAY").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Payments</CardTitle>
            <CardDescription>
              {payments.length} payment{payments.length !== 1 ? "s" : ""} in the
              system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Order Total</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Razorpay ID</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMethodIcon(payment.paymentMethod)}
                        <div className="font-mono text-sm">
                          {payment.id.slice(-8)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{payment.customerName}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {payment.vehicleMake} {payment.vehicleModel}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {payment.vehicleRegNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">
                        ₹{parseFloat(payment.amount).toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.orderTotalAmount ? (
                        <div className="text-sm text-muted-foreground">
                          ₹{parseFloat(payment.orderTotalAmount).toFixed(2)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getMethodColor(payment.paymentMethod)}>
                        {payment.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.razorpayOrderId ? (
                        <div className="font-mono text-xs">
                          {payment.razorpayOrderId}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(payment.createdAt).toLocaleDateString()}
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
