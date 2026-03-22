import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Edit, Trash2, UserX, UserCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { buildAuthHeaders, clearAuthSession, isAuthError } from "@/lib/session";

const API_BASE_URL = (() => {
  const configured = (import.meta.env.VITE_API_URL || "").trim();
  if (typeof window !== "undefined" && window.location.protocol === "https:" && configured.startsWith("http://")) {
    return "/api";
  }
  return configured || (typeof window !== "undefined" && window.location.hostname !== "localhost" ? "/api" : "http://localhost:5000");
})();

type StaffMember = {
  id: number;
  name: string;
  role: string;
  present: boolean;
  leaves: number;
  salary: number;
};

export default function Payroll() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newSalary, setNewSalary] = useState("");
  const [loading, setLoading] = useState(true);

  const loadStaff = useCallback(async () => {
    const headers = buildAuthHeaders();
    if (!headers) {
      clearAuthSession();
      window.location.href = "/admin-login";
      return;
    }

    const response = await fetch(`${API_BASE_URL}/payroll/staff`, { headers });
    if (isAuthError(response.status)) {
      clearAuthSession();
      window.location.href = "/admin-login";
      return;
    }
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || "Failed to load payroll staff");
    }
    setStaff(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadStaff();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void bootstrap();
  }, [loadStaff]);

  const handleAddStaff = async () => {
    if (!newName || !newRole || !newSalary) return;
    const headers = buildAuthHeaders();
    if (!headers) return;

    const response = await fetch(`${API_BASE_URL}/payroll/staff`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: newName.trim(),
        role: newRole.trim(),
        salary: Number(newSalary),
        present: true,
        leaves: 0,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data?.error || "Unable to add staff member");
      return;
    }

    await loadStaff();
    setShowModal(false);
    setNewName("");
    setNewRole("");
    setNewSalary("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-orange-500 drop-shadow" />
            <div>
              <h1 className="text-2xl font-bold">Payroll</h1>
              <p className="text-muted-foreground">Manage staff attendance, leaves & payroll</p>
            </div>
          </div>
          <Button className="gradient-warm text-primary-foreground gap-2 shadow-lg hover:scale-[1.04] transition-transform" onClick={() => setShowModal(true)}>
            <UserPlus className="h-4 w-4" /> Add Staff
          </Button>
        </div>
        <Card className="shadow-card bg-gradient-to-br from-orange-50 via-white to-orange-100 border-orange-100">
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="h-5 w-5 text-orange-400 mr-1" />
            <CardTitle className="text-base">Staff List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-orange-50">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Role</th>
                    <th className="text-center py-2">Present</th>
                    <th className="text-center py-2">Leaves</th>
                    <th className="text-right py-2">Salary (₹)</th>
                    <th className="text-center py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && staff.length === 0 && (
                    <tr>
                      <td className="py-8 text-center text-muted-foreground opacity-70" colSpan={6}>
                        <div className="flex flex-col items-center justify-center gap-2">
                          <UserX className="h-12 w-12 mb-2 text-orange-200" />
                          <span className="text-base">No staff found for this restaurant.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {staff.map((s) => (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-orange-50/60 transition-all">
                      <td className="py-2 font-medium flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-orange-400" /> {s.name}
                      </td>
                      <td className="py-2">{s.role}</td>
                      <td className="py-2 text-center">
                        {s.present ? (
                          <span className="text-green-600 font-semibold">Yes</span>
                        ) : (
                          <span className="text-red-500 font-semibold">No</span>
                        )}
                      </td>
                      <td className="py-2 text-center">{s.leaves}</td>
                      <td className="py-2 text-right">{s.salary.toLocaleString()}</td>
                      <td className="py-2 text-center">
                        <button className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-orange-100 text-orange-600 font-semibold text-xs mr-1">
                          <Edit className="h-4 w-4" /> Edit
                        </button>
                        <button className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-red-100 text-red-600 font-semibold text-xs">
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        {showModal && (
          <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl w-[350px]">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><UserPlus className="h-5 w-5 text-orange-400" /> Add Staff</h3>
              <input
                type="text"
                placeholder="Name"
                className="w-full border rounded px-2 py-1 mb-2"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Role"
                className="w-full border rounded px-2 py-1 mb-2"
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
              />
              <input
                type="number"
                placeholder="Salary"
                className="w-full border rounded px-2 py-1 mb-4"
                value={newSalary}
                onChange={e => setNewSalary(e.target.value)}
              />
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded font-semibold hover:bg-orange-600 transition mr-2"
                onClick={handleAddStaff}
              >
                <UserPlus className="h-4 w-4 inline mr-1" /> Add
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded font-semibold hover:bg-gray-600 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </Dialog.Panel>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}
