import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { deletePosition, fetchPosition } from "./api";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilSimpleLineIcon, TrashIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { useDialogState } from "@/hooks/use-dialog-state";
import { PositionUpdateDialog } from "./PositionUpdateDialog";
import type { UpdatePositionPayload } from "@rh/shared";
import { updatePosition } from "./api";

const PositionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateDialog = useDialogState();

  const { data: position, isFetching } = useQuery({
    queryKey: ["positions", id],
    queryFn: () => fetchPosition(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePosition(id!),
  });

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this position?")) return;

    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Deleted");
        queryClient.invalidateQueries({ queryKey: ["positions"] });
        navigate("/positions");
      },
      onError: () => {
        toast.error("Delete failed");
      },
    });
  };

  const handleUpdate = (payload: UpdatePositionPayload) => {
    updatePosition(id!, payload).then(() => {
      updateDialog.closeDialog();
      toast.success("Updated");
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["positions", id] });
    });
  };

  const positionData = position?.data;

  return (
    <div className="relative min-h-full">
      {isFetching ? (
        <div className="fixed inset-0 bg-black/60 h-full grid place-items-center z-50">
          <Spinner />
        </div>
      ) : null}

      {positionData ? (
        <div className="mx-auto max-w-4xl px-4 py-8">
          <button
            onClick={() => navigate("/positions")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeftIcon className="size-4" />
            Back to positions
          </button>

          <div className="rounded-2xl border bg-card p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold">{positionData.title}</h1>
                <p className="mt-3 text-muted-foreground leading-relaxed">{positionData.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button onClick={updateDialog.openDialog}>
                  <PencilSimpleLineIcon />
                  Edit
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <TrashIcon />
                </Button>
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h2 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide">
                Required Attributes
              </h2>
              {positionData.attributes.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {positionData.attributes.map((attr) => (
                    <Badge key={attr.id} variant="info" className="text-xs">
                      {attr.attributeId}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">No attributes assigned to this position.</p>
              )}
            </div>
          </div>

          <PositionUpdateDialog
            open={updateDialog.open}
            onOpenChange={updateDialog.setOpen}
            position={positionData}
            onSubmit={handleUpdate}
            isSubmitting={false}
          />
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
