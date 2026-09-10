import { useEffect, useState } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import Button from "../../components/Button";
import { apiFetch } from "../../lib/api";

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    const loadDisputes = async () => {
      try {
        const result = await apiFetch("/admin/disputes");
        setDisputes(result?.data || []);
      } catch (err) {
        console.error("Failed to load disputes", err);
      } finally {
        setLoading(false);
      }
    };

    loadDisputes();
  }, []);

  const handleResolveDispute = async () => {
    if (!resolution.trim()) return;

    setProcessing(selectedDispute._id);
    try {
      await apiFetch(`/admin/disputes/${selectedDispute._id}/resolve`, {
        method: "PATCH",
        body: JSON.stringify({
          resolution,
          status: "RESOLVED",
        }),
      });

      setDisputes((prev) =>
        prev.map((d) =>
          d._id === selectedDispute._id
            ? { ...d, status: "RESOLVED", resolution }
            : d
        )
      );

      setSelectedDispute(null);
      setResolution("");
    } catch (err) {
      console.error("Failed to resolve dispute", err);
    } finally {
      setProcessing(null);
    }
  };

  const openDisputes = disputes.filter((d) => d.status === "OPEN" || d.status === "IN_PROGRESS");

  return (
    <div>
      <DashboardPageHeader
        title="Dispute Management"
        description={`Handle platform disputes. ${openDisputes.length} open disputes.`}
      />

      {loading ? (
        <div className="text-sm text-muted">Loading disputes...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Disputes List */}
          <div className="lg:col-span-2">
            <div className="rounded-xl2 border border-line bg-card shadow-card">
              <div className="space-y-4 p-6">
                {disputes.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-line p-8 text-center">
                    <HiOutlineCheckCircle className="mx-auto h-12 w-12 text-emerald" />
                    <p className="mt-3 text-muted">No disputes</p>
                  </div>
                ) : (
                  disputes.map((dispute) => (
                    <div
                      key={dispute._id}
                      onClick={() => setSelectedDispute(dispute)}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                        selectedDispute?._id === dispute._id
                          ? "border-emerald bg-emerald/5"
                          : "border-line hover:border-emerald/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {dispute.status === "OPEN" ? (
                              <HiOutlineExclamationTriangle className="h-5 w-5 text-red-500" />
                            ) : dispute.status === "IN_PROGRESS" ? (
                              <HiOutlineExclamationTriangle className="h-5 w-5 text-yellow-600" />
                            ) : (
                              <HiOutlineCheckCircle className="h-5 w-5 text-emerald" />
                            )}
                            <h3 className="font-display font-semibold text-ink">
                              Dispute on Booking
                            </h3>
                          </div>
                          <p className="mt-1 text-sm text-muted">
                            {dispute.description || "No description provided"}
                          </p>
                          <div className="mt-2 flex items-center gap-4 text-xs text-muted">
                            <span>
                              Initiated by: {dispute.initiatedBy?.name} ({dispute.initiatedBy?.role})
                            </span>
                            <span>
                              {new Date(dispute.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            dispute.status === "OPEN"
                              ? "bg-red-50 text-red-900"
                              : dispute.status === "IN_PROGRESS"
                                ? "bg-yellow-50 text-yellow-900"
                                : "bg-emerald/10 text-emerald"
                          }`}
                        >
                          {dispute.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Dispute Details & Resolution */}
          {selectedDispute ? (
            <div className="rounded-xl2 border border-line bg-card p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold text-ink">
                Resolve Dispute
              </h3>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted">Status</label>
                  <p className="mt-1 rounded-lg bg-surface px-3 py-2 text-sm text-ink">
                    {selectedDispute.status}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted">Reason</label>
                  <p className="mt-1 text-sm text-ink">
                    {selectedDispute.description || "No description"}
                  </p>
                </div>

                {selectedDispute.status !== "RESOLVED" && (
                  <>
                    <div>
                      <label htmlFor="resolution" className="text-sm font-medium text-muted">
                        Resolution
                      </label>
                      <textarea
                        id="resolution"
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        placeholder="Enter your resolution..."
                        rows={4}
                        className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder-muted focus:border-emerald focus:outline-none"
                      />
                    </div>

                    <Button
                      onClick={handleResolveDispute}
                      disabled={!resolution.trim() || processing === selectedDispute._id}
                      className="w-full"
                    >
                      {processing === selectedDispute._id
                        ? "Resolving..."
                        : "Resolve Dispute"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl2 border border-dashed border-line p-6 text-center">
              <p className="text-sm text-muted">Select a dispute to view details</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
