import type { ColumnDef } from "@tanstack/react-table";
import type { AttributeWithUsage } from "./api";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

export const attributeColumns: ColumnDef<AttributeWithUsage>[] = [
  {
    id: "id",
    header: ({ table }) => (
      <Checkbox
        name="selectAll"
        id="selectAll"
        className="checkbox"
        indeterminate={table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        name="selectAll"
        id="selectAll"
        className="checkbox"
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
  },
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
    cell({ getValue }) {
      return format(new Date(getValue<string>()), "PPPP");
    },
  },
];
