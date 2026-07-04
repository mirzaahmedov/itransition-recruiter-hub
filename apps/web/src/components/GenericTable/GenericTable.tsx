import { flexRender, type Table } from "@tanstack/react-table";

type GenericTableProps<T> = {
  instance: Table<T>;
};
export const GenericTable = <T,>({ instance }: GenericTableProps<T>) => {
  return (
    <table className="table table-zebra">
      <thead>
        {instance.getHeaderGroups().map((group) => (
          <tr key={group.id}>
            {group.headers.map((header) => (
              <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {instance.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((column) => (
              <td key={column.id}>{flexRender(column.column.columnDef.cell, column.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
