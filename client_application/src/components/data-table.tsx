type DataTableProps = {
  columns: string[];
  /** One array per row, in the same order as columns. A short row leaves its last cells empty. */
  rows: string[][];
};

/** A plain table that scrolls sideways on its own when it's wider than the page. */
export function DataTable({ columns, rows }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-xs tabular-nums">
        <thead className="bg-muted/50">
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col" className="px-3 py-2 text-left font-medium whitespace-nowrap">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {columns.map((column, columnIndex) => (
                <td key={column} className="px-3 py-2 whitespace-nowrap">
                  {row[columnIndex] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
