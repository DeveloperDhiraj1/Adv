import { useEffect, useState } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineXMark,
} from "react-icons/hi2";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import Button from "../../components/Button";
import { apiFetch } from "../../lib/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const result = await apiFetch("/admin/users");
        setUsers(result?.data || []);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleDeactivate = async (userId) => {
    setProcessing(userId);
    try {
      await apiFetch(`/admin/users/${userId}/deactivate`, {
        method: "PATCH",
      });

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: false } : u))
      );
    } catch (err) {
      console.error("Failed to deactivate user", err);
    } finally {
      setProcessing(null);
    }
  };

  const handleActivate = async (userId) => {
    setProcessing(userId);
    try {
      await apiFetch(`/admin/users/${userId}/activate`, {
        method: "PATCH",
      });

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: true } : u))
      );
    } catch (err) {
      console.error("Failed to activate user", err);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div>
      <DashboardPageHeader
        title="User Management"
        description="Manage platform users and their access."
      />

      {loading ? (
        <div className="text-sm text-muted">Loading users...</div>
      ) : (
        <div className="rounded-xl2 border border-line bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface">
                  <th className="px-6 py-4 text-left font-medium text-muted">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-line/50 hover:bg-surface/50">
                    <td className="px-6 py-4 font-medium text-ink">{user.name}</td>
                    <td className="px-6 py-4 text-muted">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-900">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.isActive ? (
                          <>
                            <HiOutlineCheckCircle className="h-5 w-5 text-emerald" />
                            <span className="text-emerald">Active</span>
                          </>
                        ) : (
                          <>
                            <HiOutlineXMark className="h-5 w-5 text-red-500" />
                            <span className="text-red-500">Inactive</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeactivate(user._id)}
                          disabled={processing === user._id}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          {processing === user._id ? "..." : "Deactivate"}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleActivate(user._id)}
                          disabled={processing === user._id}
                          className="border-emerald/30 text-emerald"
                        >
                          {processing === user._id ? "..." : "Activate"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
