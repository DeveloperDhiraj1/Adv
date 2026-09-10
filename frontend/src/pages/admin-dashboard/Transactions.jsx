import { useEffect, useState } from "react";
import { HiOutlineCreditCard } from "react-icons/hi2";
import DashboardPageHeader from "../../components/DashboardPageHeader";
import { apiFetch } from "../../lib/api";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const result = await apiFetch("/admin/transactions");
        setTransactions(result?.data || []);
      } catch (err) {
        console.error("Failed to load transactions", err);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const successCount = transactions.filter((t) => t.paymentStatus === "SUCCESS").length;
  const failedCount = transactions.filter((t) => t.paymentStatus === "FAILED").length;
  const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div>
      <DashboardPageHeader
        title="Transaction History"
        description="View and manage payment transactions."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl2 border border-line bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Total Transactions</p>
              <p className="mt-2 font-display text-2xl font-bold text-ink">
                {transactions.length}
              </p>
            </div>
            <HiOutlineCreditCard className="h-8 w-8 text-emerald" />
          </div>
        </div>

        <div className="rounded-xl2 border border-line bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Successful</p>
              <p className="mt-2 font-display text-2xl font-bold text-emerald">
                {successCount}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-emerald/10" />
          </div>
        </div>

        <div className="rounded-xl2 border border-line bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Total Revenue</p>
              <p className="mt-2 font-display text-2xl font-bold text-ink">
                ₹{totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-yellow-50" />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="mt-8 text-sm text-muted">Loading transactions...</div>
      ) : (
        <div className="mt-8 rounded-xl2 border border-line bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface">
                  <th className="px-6 py-4 text-left font-medium text-muted">
                    User
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted">
                    Payment Method
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id} className="border-b border-line/50 hover:bg-surface/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink">{txn.userId?.name}</p>
                      <p className="text-xs text-muted">{txn.userId?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-display font-semibold text-ink">
                      ₹{txn.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {txn.paymentMethod || "Razorpay"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          txn.paymentStatus === "SUCCESS"
                            ? "bg-emerald/10 text-emerald"
                            : txn.paymentStatus === "PENDING"
                              ? "bg-yellow-50 text-yellow-900"
                              : "bg-red-50 text-red-900"
                        }`}
                      >
                        {txn.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted">{formatDate(txn.createdAt)}</td>
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
