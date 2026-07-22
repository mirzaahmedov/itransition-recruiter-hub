import { GenericTable } from "@/components/GenericTable/GenericTable";
import { Spinner } from "@/components/ui/spinner";
import { rowDataWithFallback } from "@/lib/table/utils";
import { useQuery } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { fetchCandidates, type CandidateUser } from "./api";
import { candidateColumns } from "./columns";

const CandidatesPage = () => {
  const navigate = useNavigate();

  const { data: candidates, isLoading } = useQuery({
    queryKey: ["candidates"],
    queryFn: fetchCandidates,
  });

  const rowData = rowDataWithFallback(candidates?.data);

  const table = useReactTable<CandidateUser>({
    getCoreRowModel: getCoreRowModel(),
    data: rowData,
    getRowId: (row) => row.id,
    columns: candidateColumns,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Candidates</h1>
          <p className="text-sm text-muted-foreground mt-1">See can candidates who has applied to positions</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <GenericTable table={table} onRowClick={(row) => navigate(`${row.original.id}/profile`)} />
        )}
      </div>
    </div>
  );
};

export default CandidatesPage;
