import { useEffect, useState } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineXMark,
} from "react-icons/hi2";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import Button from "../../components/Button";
import { apiFetch } from "../../lib/api";

export default function AdminExperts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    const loadExperts = async () => {
      try {
        const result = await apiFetch("/admin/experts");
        setExperts(result?.data || []);
      } catch (err) {
        console.error("Failed to load experts", err);
      } finally {
        setLoading(false);
      }
    };

    loadExperts();
  }, []);

  const handleVerify = async (expertId) => {
    setProcessing(expertId);
    try {
      await apiFetch(`/admin/experts/${expertId}/verify`, {
        method: "PATCH",
      });

      setExperts((prev) =>
        prev.map((e) => (e._id === expertId ? { ...e, isVerified: true } : e))
      );
    } catch (err) {
      console.error("Failed to verify expert", err);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (expertId) => {
    setProcessing(expertId);
    try {
      await apiFetch(`/admin/experts/${expertId}/reject`, {
        method: "PATCH",
      });

      setExperts((prev) =>
        prev.map((e) => (e._id === expertId ? { ...e, isVerified: false } : e))
      );
    } catch (err) {
      console.error("Failed to reject expert", err);
    } finally {
      setProcessing(null);
    }
  };

  const unverifiedCount = experts.filter((e) => !e.isVerified).length;

  return (
    <div>
      <DashboardPageHeader
        title="Expert Management"
        description={`Verify and manage platform experts. ${unverifiedCount} pending verification.`}
      />

      {loading ? (
        <div className="text-sm text-muted">Loading experts...</div>
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
                    Headline
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted">
                    Verification
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
                {experts.map((expert) => (
                  <tr key={expert._id} className="border-b border-line/50 hover:bg-surface/50">
                    <td className="px-6 py-4 font-medium text-ink">
                      {expert.userId?.name}
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {expert.userId?.email}
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {expert.headline || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {expert.isVerified ? (
                          <>
                            <HiOutlineCheckCircle className="h-5 w-5 text-emerald" />
                            <span className="text-emerald">Verified</span>
                          </>
                        ) : (
                          <>
                            <HiOutlineXMark className="h-5 w-5 text-yellow-600" />
                            <span className="text-yellow-600">Pending</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {new Date(expert.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {expert.isVerified ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(expert._id)}
                          disabled={processing === expert._id}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          {processing === expert._id ? "..." : "Reject"}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerify(expert._id)}
                          disabled={processing === expert._id}
                          className="border-emerald/30 text-emerald"
                        >
                          {processing === expert._id ? "..." : "Verify"}
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
