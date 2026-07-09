import { useDialogState } from "@/hooks/use-dialog-state";
import { PositionCreateDialog } from "./PositionCreateDialog";
import { useMutation } from "@tanstack/react-query";
import { createPosition } from "./api";
import type { PositionCreatePayload } from "@rh/shared";
import toast from "react-hot-toast";
import { PositionList } from "./PositionList";
import { Toolbar, ToolbarButton } from "@/components/ui/toolbar";

const PositionsPage = () => {
  const positionCreateDialog = useDialogState();

  const createPositionMutation = useMutation({
    mutationFn: createPosition,
  });

  const handleSubmit = (payload: PositionCreatePayload) => {
    createPositionMutation.mutate(payload, {
      onSuccess: () => {
        positionCreateDialog.closeDialog();
        toast.success("Created");
      },
    });
  };

  return (
    <div>
      <Toolbar>
        <PositionCreateDialog
          isSubmitting={createPositionMutation.isPending}
          open={positionCreateDialog.open}
          onOpenChange={positionCreateDialog.setOpen}
          onSubmit={handleSubmit}
          btnRender={<ToolbarButton />}
        />
      </Toolbar>

      <PositionList />
    </div>
  );
};

export default PositionsPage;
