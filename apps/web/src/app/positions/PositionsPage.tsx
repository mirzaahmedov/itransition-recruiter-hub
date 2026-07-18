import { useDialogState } from "@/hooks/use-dialog-state";
import { PositionCreateDialog } from "./PositionCreateDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPosition } from "./api";
import type { CreatePositionPayload } from "@rh/shared";
import toast from "react-hot-toast";
import { PositionCardGrid } from "./PositionCardGrid";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react";

const PositionsPage = () => {
  const positionCreateDialog = useDialogState();
  const queryClient = useQueryClient();

  const createPositionMutation = useMutation({
    mutationFn: createPosition,
  });

  const handleSubmit = (payload: CreatePositionPayload) => {
    createPositionMutation.mutate(payload, {
      onSuccess: () => {
        positionCreateDialog.closeDialog();
        toast.success("Created");
        queryClient.invalidateQueries({
          queryKey: ["positions"],
        });
      },
    });
  };

  console.log({
    open: positionCreateDialog.open,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Positions</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse and manage job positions</p>
        </div>
        <PositionCreateDialog
          isSubmitting={createPositionMutation.isPending}
          open={positionCreateDialog.open}
          onOpenChange={positionCreateDialog.setOpen}
          onSubmit={handleSubmit}
          trigger={
            <Button>
              <PlusIcon />
              New Position
            </Button>
          }
        />
      </div>
      <PositionCardGrid />
    </div>
  );
};

export default PositionsPage;
