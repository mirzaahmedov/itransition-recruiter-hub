import { fetchPositionResumes } from "@/app/resumes/api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { parseApiErrorMessage } from "@/lib/api/error";
import { ArrowLeftIcon, ArrowRightIcon, ReadCvLogoIcon, TrashIcon } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { applyToPosition, deletePosition, fetchPosition } from "./api";
import { PositionHeader } from "./PositionHeader";
import { PositionAttributes } from "./PositionAttributes";
import { Badge } from "@/components/ui/badge";
import { Can } from "@casl/react";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

const PositionPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: position, isFetching } = useQuery({
    queryKey: ["positions", id],
    queryFn: () => fetchPosition(id!),
    enabled: !!id,
  });

  const { data: resumesData, isLoading: isLoadingResumes } = useQuery({
    queryKey: ["positions", id, "resumes"],
    queryFn: () => fetchPositionResumes(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePosition(id!),
  });

  const applyMutation = useMutation({
    mutationFn: () => applyToPosition(id!),
  });

  const handleApply = () => {
    applyMutation.mutate(undefined, {
      onSuccess: (res) => {
        toast.success("Application sent");
        queryClient.invalidateQueries({ queryKey: ["positions"] });
        queryClient.invalidateQueries({ queryKey: ["positions", id, "resumes"] });
        queryClient.invalidateQueries({ queryKey: ["resumes"] });

        navigate(`/resumes/${res?.data?.id}`);
      },
      onError: (res) => {
        const message = parseApiErrorMessage(res);
        toast.error(message ?? "Application failed");
      },
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Deleted");
        queryClient.invalidateQueries({ queryKey: ["positions"] });
        navigate("/positions");
      },
      onError: (res) => {
        const message = parseApiErrorMessage(res);
        toast.error(message ?? "Delete failed");
      },
    });
  };

  const positionData = position?.data;
  const resumes = resumesData?.data ?? [];

  return (
    <div className="relative min-h-full">
      {isFetching ? (
        <div className="fixed inset-0 bg-black/60 h-full grid place-items-center z-50">
          <Spinner />
        </div>
      ) : null}

      {positionData ? (
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate("/positions")}>
              <ArrowLeftIcon className="size-4" />
              Back to positions
            </Button>
            <div className="flex items-center gap-2">
              <Can I="delete" a="Position">
                <DeleteConfirmDialog
                  onConfirm={handleDelete}
                  render={
                    <Button variant="destructive-outline" loading={deleteMutation.isPending}>
                      <TrashIcon /> Delete
                    </Button>
                  }
                />
              </Can>
              <Can I="apply" a="Position">
                {positionData.resumes?.length === 0 ? (
                  <Button onClick={handleApply} loading={applyMutation.isPending}>
                    <ReadCvLogoIcon />
                    Apply
                  </Button>
                ) : null}
              </Can>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-8">
            <PositionHeader position={positionData} />
            <PositionAttributes position={positionData} />

            {isLoadingResumes ? (
              <div className="flex items-center justify-center py-20">
                <Spinner />
              </div>
            ) : (
              resumes.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <h2 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide">Applications ({resumes.length})</h2>
                  <div className="mt-4 space-y-2">
                    {resumes.map((resume) => (
                      <Link
                        key={resume.id}
                        to={`/resumes/${resume.id}`}
                        className="flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-accent/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{resume.user?.name ?? "Unnamed"}</span>
                          <Badge variant={resume.status === "PUBLISHED" ? "success" : "warning"} size="sm">
                            {resume.status}
                          </Badge>
                        </div>
                        <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        !isFetching && (
          <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="text-center py-20">
              <p className="text-muted-foreground">Position not found.</p>
              <Button variant="ghost" className="mt-4" onClick={() => navigate("/positions")}>
                Back to positions
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PositionPage;
