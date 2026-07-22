import type { AttributeGetPayload } from "@rh/database/models";
import type { ColumnDef } from "@tanstack/react-table";

export const attributeColumns: ColumnDef<
  AttributeGetPayload<{
    include: {
      choices: true;
      category: true;
    };
  }>
>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => row.original.category.name,
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
    accessorKey: "createdAt",
    header: "Created At",
  },
];
