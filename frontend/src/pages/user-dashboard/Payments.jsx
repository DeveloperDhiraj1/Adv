import { useEffect, useState } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineArrowDownTray,
} from "react-icons/hi2";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import Button from "../../components/Button";
import { apiFetch } from "../../lib/api";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, SUCCESS, PENDING, FAILED
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        const status = filter !== "all" ? filter : "";
        const query = new URLSearchParams({
          page,
          limit: 10,
          ...(status && { status }),
        });

        const result = await apiFetch(`/payments/my-payments?${query}`);
        setPayments(result?.data || []);
        setTotalPages(result?.totalPages || 1);
      } catch (err) {
        console.error("Failed to load payments", err);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [filter, page]);

  const getStatusIcon = (status) => {
    if (status === "SUCCESS") return HiOutlineCheckCircle;
    if (status === "FAILED") return HiOutlineXCircle;
    return HiOutlineClock;
  };

  const getStatusColor = (status) => {
    if (status === "SUCCESS") return "bg-emerald-50 text-emerald-900";
    if (status === "FAILED") return "bg-red-50 text-red-900";
    return "bg-yellow-50 text-yellow-900";
  };

  const getStatusBadge = (status) => {
    if (status === "SUCCESS") return "Successful";
    if (status === "FAILED") return "Failed";
    return "Pending";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const successCount = payments.filter((p) => p.status === "SUCCESS").length;

  return (
    <div>
      <DashboardPageHeader
        title="Payment History"
        description="View and manage your payment transactions."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl2 border border-line bg-card p-6">
          <p className="text-sm text-muted">Total Spent</p>
          <p className="mt-2 font-display text-2xl font-bold text-ink">
            ₹{totalAmount.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl2 border border-line bg-card p-6">
          <p className="text-sm text-muted">Successful Payments</p>
          <p className="mt-2 font-display text-2xl font-bold text-emerald">
            {successCount}
          </p>
        </div>

        <div className="rounded-xl2 border border-line bg-card p-6">
          <p className="text-sm text-muted">Total Transactions</p>
          <p className="mt-2 font-display text-2xl font-bold text-ink">
            {payments.length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="mt-8 flex gap-2">
        <button
          onClick={() => {
            setFilter("all");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-emerald text-navy"
              : "bg-ink/5 text-muted hover:bg-ink/10"
          }`}
        >
          All
        </button>
        <button
          onClick={() => {
            setFilter("SUCCESS");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "SUCCESS"
              ? "bg-emerald text-navy"
              : "bg-ink/5 text-muted hover:bg-ink/10"
          }`}
        >
          Successful
        </button>
        <button
          onClick={() => {
            setFilter("PENDING");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "PENDING"
              ? "bg-emerald text-navy"
              : "bg-ink/5 text-muted hover:bg-ink/10"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => {
            setFilter("FAILED");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "FAILED"
              ? "bg-emerald text-navy"
              : "bg-ink/5 text-muted hover:bg-ink/10"
          }`}
        >
          Failed
        </button>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="mt-8 text-sm text-muted">Loading payments...</div>
      ) : payments.length === 0 ? (
        <div className="mt-8 rounded-xl2 border border-dashed border-line bg-card p-10 text-center">
          <HiOutlineArrowDownTray className="mx-auto h-12 w-12 text-muted/30" />
          <p className="mt-3 text-muted">No payments yet</p>
        </div>
      ) : (
        <>
          <div className="mt-8 rounded-xl2 border border-line bg-card shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface">
                    <th className="px-6 py-4 text-left font-medium text-muted">
                      Transaction ID
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-muted">
                      Expert
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-muted">
                      Service
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-muted">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-muted">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-muted">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const StatusIcon = getStatusIcon(payment.status);
                    const statusColor = getStatusColor(payment.status);

                    return (
                      <tr
                        key={payment.id}
                        className="border-b border-line/50 hover:bg-surface/50"
                      >
                        <td className="px-6 py-4">
                          <code className="text-xs font-medium text-ink">
                            {payment.transactionId?.slice(-12) ||
                              payment.id.slice(-8).toUpperCase()}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-muted">
                          {payment.expertName || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-ink">
                          {payment.serviceName || "Session"}
                        </td>
                        <td className="px-6 py-4 font-display font-semibold text-emerald">
                          ₹{payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-muted">
                          {formatDate(payment.date)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-5 w-5" />
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor}`}
                            >
                              {getStatusBadge(payment.status)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
