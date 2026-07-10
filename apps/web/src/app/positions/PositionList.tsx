import { GenericTable } from "@/components/GenericTable/GenericTable";
import { useQuery } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { fetchPositions } from "./api";
import { rowDataWithFallback } from "@/lib/table/utils";
import type { PositionGetPayload } from "@rh/database/models";
import { Badge } from "@/components/ui/badge";

const columns: ColumnDef<
  PositionGetPayload<{
    include: {
      attributes: true;
    };
  }>
>[] = [
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    id: "attributes",
    header: "Attributes",
    cell: ({ row }) => <Badge variant="info">{row.original.attributes.length}</Badge>,
  },
];

export const PositionList = () => {
  const { data: positions } = useQuery({
    queryKey: ["positions"],
    queryFn: fetchPositions,
  });

  const rowData = rowDataWithFallback(positions?.data);

  const table = useReactTable({
    data: rowData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <GenericTable instance={table} />;
};
