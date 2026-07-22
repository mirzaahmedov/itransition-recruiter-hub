import type { ColumnDef } from "@tanstack/react-table";
import type { AttributeWithUsage } from "./api";

export const attributeColumns: ColumnDef<AttributeWithUsage>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => row.original.category?.name,
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "choices",
    header: "Choices",
    cell({ row }) {
      return row.original.choices.length;
    },
  },
  {
    id: "usage",
    header: "Usage",
    cell({ row }) {
      const count = (row.original._count?.values ?? 0) + (row.original._count?.positionAttributes ?? 0);
      return count > 0 ? count : "—";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];
