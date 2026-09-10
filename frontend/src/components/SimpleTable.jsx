export default function SimpleTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl2 border border-line bg-card shadow-card">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-ink/[0.03] text-xs font-semibold uppercase tracking-wide text-muted">
            {columns.map((col) => (
              <th key={col} className="px-5 py-3.5">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-line last:border-0 hover:bg-ink/[0.03]">
              {row.map((cell, j) => (
                <td key={j} className="px-5 py-4 text-ink">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="px-5 py-10 text-center text-sm text-muted">No records yet.</p>
      )}
    </div>
  );
}
