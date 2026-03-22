import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListChecks, PlusCircle, Edit, Trash2, ClipboardX } from "lucide-react";
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

type TaskItem = {
  id: number;
  title: string;
  status: string;
  assigned_to: string;
};

const statusColor: Record<string, string> = {
  "Pending": "bg-warning/10 text-warning border-warning/20",
  "In Progress": "bg-info/10 text-info border-info/20",
  "Completed": "bg-success/10 text-success border-success/20",
};

export default function Tasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAssigned, setNewAssigned] = useState("");
  const [newStatus, setNewStatus] = useState("Pending");
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    const headers = buildAuthHeaders();
    if (!headers) {
      clearAuthSession();
      window.location.href = "/admin-login";
      return;
    }

    const response = await fetch(`${API_BASE_URL}/tasks`, { headers });
    if (isAuthError(response.status)) {
      clearAuthSession();
      window.location.href = "/admin-login";
      return;
    }
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || "Failed to load tasks");
    }
    setTasks(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadTasks();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void bootstrap();
  }, [loadTasks]);

  const handleAddTask = async () => {
    if (!newTitle || !newAssigned) return;
    const headers = buildAuthHeaders();
    if (!headers) return;

    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: newTitle.trim(),
        assignedTo: newAssigned.trim(),
        status: newStatus,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      alert(data?.error || "Unable to create task");
      return;
    }
    await loadTasks();
    setShowModal(false);
    setNewTitle("");
    setNewAssigned("");
    setNewStatus("Pending");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ListChecks className="h-8 w-8 text-orange-500 drop-shadow" />
            <div>
              <h1 className="text-2xl font-bold">Tasks</h1>
              <p className="text-muted-foreground">Create, automate & track daily tasks</p>
            </div>
          </div>
          <Button className="gradient-warm text-primary-foreground gap-2 shadow-lg hover:scale-[1.04] transition-transform" onClick={() => setShowModal(true)}>
            <PlusCircle className="h-4 w-4" /> Add Task
          </Button>
        </div>
        <Card className="shadow-card bg-gradient-to-br from-orange-50 via-white to-orange-100 border-orange-100">
          <CardHeader className="flex flex-row items-center gap-2">
            <ListChecks className="h-5 w-5 text-orange-400 mr-1" />
            <CardTitle className="text-base">Task List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-orange-50">
                    <th className="text-left py-2">Task</th>
                    <th className="text-left py-2">Assigned To</th>
                    <th className="text-center py-2">Status</th>
                    <th className="text-center py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && tasks.length === 0 && (
                    <tr>
                      <td className="py-8 text-center text-muted-foreground opacity-70" colSpan={4}>
                        <div className="flex flex-col items-center justify-center gap-2">
                          <ClipboardX className="h-12 w-12 mb-2 text-orange-200" />
                          <span className="text-base">No tasks found for this restaurant.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b last:border-0 hover:bg-orange-50/60 transition-all">
                      <td className="py-2 font-medium">{task.title}</td>
                      <td className="py-2">{task.assigned_to}</td>
                      <td className="py-2 text-center">
                        <span className={`px-2 py-1 rounded ${statusColor[task.status]}`}>{task.status}</span>
                      </td>
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
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><PlusCircle className="h-5 w-5 text-orange-400" /> Add Task</h3>
              <input
                type="text"
                placeholder="Task Title"
                className="w-full border rounded px-2 py-1 mb-2"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Assigned To"
                className="w-full border rounded px-2 py-1 mb-2"
                value={newAssigned}
                onChange={e => setNewAssigned(e.target.value)}
              />
              <select
                className="w-full border rounded px-2 py-1 mb-4"
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded font-semibold hover:bg-orange-600 transition mr-2"
                onClick={handleAddTask}
              >
                <PlusCircle className="h-4 w-4 inline mr-1" /> Add
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
