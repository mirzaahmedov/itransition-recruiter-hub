import { flexRender, type Row, type Table as TanstackTable } from "@tanstack/react-table";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";

type GenericTableProps<T> = {
  instance: TanstackTable<T>;
  onRowClick?: (row: Row<T>) => void;
};
export const GenericTable = <T,>({ instance, onRowClick }: GenericTableProps<T>) => {
  return (
    <Table>
      <TableHeader>
        {instance.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => (
              <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {instance.getRowModel().rows.map((row) => (
          <TableRow key={row.id} onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button, input, [role='checkbox'], label")) return;
            onRowClick?.(row);
          }} className={typeof onRowClick === "function" ? "cursor-pointer" : ""}>
            {row.getVisibleCells().map((column) => (
              <TableCell key={column.id}>{flexRender(column.column.columnDef.cell, column.getContext())}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
