import { useDialogState } from "@/hooks/use-dialog-state";
import { PositionCreateDialog } from "./PositionCreateDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPosition } from "./api";
import type { PositionCreatePayload } from "@rh/shared";
import toast from "react-hot-toast";
import { PositionList } from "./PositionList";
import { Toolbar, ToolbarButton } from "@/components/ui/toolbar";

const PositionsPage = () => {
  const positionCreateDialog = useDialogState();
  const queryClient = useQueryClient();

  const createPositionMutation = useMutation({
    mutationFn: createPosition,
  });

  const handleSubmit = (payload: PositionCreatePayload) => {
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

  return (
    <div>
      <Toolbar>
        <ToolbarButton
          render={
            <PositionCreateDialog
              isSubmitting={createPositionMutation.isPending}
              open={positionCreateDialog.open}
              onOpenChange={positionCreateDialog.setOpen}
              onSubmit={handleSubmit}
            />
          }
        />
      </Toolbar>

      <PositionList />
    </div>
  );
};

export default PositionsPage;
