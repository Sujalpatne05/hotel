import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { buildAuthHeaders, clearAuthSession, isAuthError } from "@/lib/session";

type ReservationStatus = "pending" | "confirmed" | "seated" | "completed" | "cancelled";

type Reservation = {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tableNumber: string;
  status: ReservationStatus;
};

type ApiReservation = {
  id: number;
  customer_name: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  table_number: string;
  status: ReservationStatus;
};

const API_BASE_URL = (() => {
  const configured = (import.meta.env.VITE_API_URL || "").trim();
  if (typeof window !== "undefined" && window.location.protocol === "https:" && configured.startsWith("http://")) {
    return "/api";
  }
  return configured || (typeof window !== "undefined" && window.location.hostname !== "localhost" ? "/api" : "http://localhost:5000");
})();

const statusColor: Record<ReservationStatus, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  seated: "bg-purple-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

export default function Reservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
    const goToLogin = (message = "Session expired. Please login again.") => {
      setError(message);
      clearAuthSession();
      setTimeout(() => navigate("/admin-login"), 300);
    };

  const [filterStatus, setFilterStatus] = useState<"all" | ReservationStatus>("all");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    tableNumber: "",
  });

  const filteredReservations = useMemo(
    () => reservations.filter((reservation) => filterStatus === "all" || reservation.status === filterStatus),
    [reservations, filterStatus],
  );

  const toUiReservation = (item: ApiReservation): Reservation => ({
    id: item.id,
    name: item.customer_name,
    phone: item.customer_phone,
    date: item.reservation_date,
    time: item.reservation_time,
    guests: Number(item.guests),
    tableNumber: item.table_number,
    status: item.status,
  });

  const loadReservations = async () => {
    try {
      setError("");
      const headers = buildAuthHeaders();
      if (!headers) {
        goToLogin("Please login to continue.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/reservations`, { headers });
      const data = await response.json();
      if (isAuthError(response.status)) {
        goToLogin(data?.error || "Session expired. Please login again.");
        return;
      }
      if (!response.ok) {
        setError(data?.error || "Unable to load reservations.");
        return;
      }
      setReservations((Array.isArray(data) ? data : []).map(toUiReservation));
    } catch {
      setError("Unable to connect to backend.");
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const addReservation = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.date || !form.time || !form.tableNumber.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const headers = buildAuthHeaders();
      if (!headers) {
        goToLogin("Please login to continue.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          customer_name: form.name.trim(),
          customer_phone: form.phone.trim(),
          reservation_date: form.date,
          reservation_time: form.time,
          guests: Number(form.guests),
          table_number: form.tableNumber.trim().toUpperCase(),
          status: "pending",
        }),
      });
      const data = await response.json();
      if (isAuthError(response.status)) {
        goToLogin(data?.error || "Session expired. Please login again.");
        return;
      }
      if (!response.ok) {
        setError(data?.error || "Unable to create reservation.");
        return;
      }

      // Update table status to reserved
      try {
        const tableNumber = Number(form.tableNumber.trim().replace(/\D/g, ""));
        if (Number.isFinite(tableNumber)) {
          // Fetch tables to find the table ID
          const tablesResponse = await fetch(`${API_BASE_URL}/tables`, { headers });
          const tables = await tablesResponse.json();
          const table = Array.isArray(tables) ? tables.find((t: any) => t.table_number === tableNumber || t.number === tableNumber) : null;
          
          if (table) {
            await fetch(`${API_BASE_URL}/tables/${table.id}`, {
              method: "PUT",
              headers,
              body: JSON.stringify({
                status: "reserved",
                reserved_by: form.name.trim(),
                estimated_time: form.time,
              }),
            });
          }
        }
      } catch (err) {
        console.error("Failed to update table status:", err);
        // Don't fail the reservation if table update fails
      }

      setReservations((prev) => [toUiReservation(data), ...prev]);
      setForm({ name: "", phone: "", date: "", time: "", guests: "2", tableNumber: "" });
      toast.success("Reservation created and table marked as reserved");
    } catch {
      setError("Unable to connect to backend.");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id: number, status: ReservationStatus) => {
    const previous = reservations;
    const reservation = reservations.find(r => r.id === id);
    
    setReservations((prev) => prev.map((reservation) => (reservation.id === id ? { ...reservation, status } : reservation)));

    try {
      const headers = buildAuthHeaders();
      if (!headers) {
        goToLogin("Please login to continue.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/reservations/${id}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (isAuthError(response.status)) {
        goToLogin(data?.error || "Session expired. Please login again.");
        return;
      }
      if (!response.ok) {
        setReservations(previous);
        setError(data?.error || "Unable to update reservation status.");
        return;
      }

      // Update table status based on reservation status
      if (reservation) {
        try {
          const tableNumber = Number(reservation.tableNumber.replace(/\D/g, ""));
          if (Number.isFinite(tableNumber)) {
            // Fetch tables to find the table ID
            const tablesResponse = await fetch(`${API_BASE_URL}/tables`, { headers });
            const tables = await tablesResponse.json();
            const table = Array.isArray(tables) ? tables.find((t: any) => t.table_number === tableNumber || t.number === tableNumber) : null;
            
            if (table) {
              let tableStatus = "available";
              let tableData: any = { status: tableStatus };
              
              if (status === "seated") {
                tableStatus = "occupied";
                tableData = { status: tableStatus, reserved_by: null };
              } else if (status === "cancelled") {
                tableStatus = "available";
                tableData = { status: tableStatus, reserved_by: null, estimated_time: null };
              } else if (status === "confirmed" || status === "pending") {
                tableStatus = "reserved";
                tableData = { status: tableStatus, reserved_by: reservation.name, estimated_time: reservation.time };
              }
              
              await fetch(`${API_BASE_URL}/tables/${table.id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify(tableData),
              });
            }
          }
        } catch (err) {
          console.error("Failed to update table status:", err);
          // Don't fail the status update if table update fails
        }
      }

      toast.success("Reservation status updated");
    } catch {
      setReservations(previous);
      setError("Unable to connect to backend.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Reservations</h1>
          <p className="text-muted-foreground">Create and manage table reservations</p>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Add Reservation</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Customer name" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone number" />
            </div>
            <div>
              <Label>Table</Label>
              <Input value={form.tableNumber} onChange={(e) => setForm((prev) => ({ ...prev, tableNumber: e.target.value }))} placeholder="T5" />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} />
            </div>
            <div>
              <Label>Time</Label>
              <Input type="time" value={form.time} onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))} />
            </div>
            <div>
              <Label>Guests</Label>
              <Input type="number" min={1} value={form.guests} onChange={(e) => setForm((prev) => ({ ...prev, guests: e.target.value }))} />
            </div>
            <div className="md:col-span-3">
              <Button className="gradient-warm text-primary-foreground" disabled={saving} onClick={addReservation}>
                {saving ? "Saving..." : "Add Reservation"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Reservation List</CardTitle>
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as "all" | ReservationStatus)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="seated">Seated</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredReservations.length === 0 && <p className="text-sm text-muted-foreground">No reservations found.</p>}
            {filteredReservations.map((reservation) => (
              <div key={reservation.id} className="border rounded-lg p-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{reservation.name}</p>
                  <p className="text-xs text-muted-foreground">R-{reservation.id} | {reservation.phone}</p>
                  <p className="text-sm">{reservation.date} at {reservation.time} | Guests: {reservation.guests} | Table: {reservation.tableNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColor[reservation.status]}>{reservation.status}</Badge>
                  <Select value={reservation.status} onValueChange={(value) => updateStatus(reservation.id, value as ReservationStatus)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="seated">Seated</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

