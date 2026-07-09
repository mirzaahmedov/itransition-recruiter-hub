import { GenericTable } from "@/components/GenericTable/GenericTable";
import { useQuery } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { fetchPositions } from "./api";

export const PositionList = () => {
  const { data: positions } = useQuery({
    queryKey: ["positions"],
    queryFn: fetchPositions,
  });

  const table = useReactTable({
    data: positions?.data ?? [],
    columns: [
      {
        accessorKey: "title",
      },
      {
        accessorKey: "description",
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return <GenericTable instance={table} />;
};
