import { AttributePicker } from "@/components/AttributePicker/AttributePicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDialogState } from "@/hooks/use-dialog-state";
import { Can } from "@casl/react";
import { PencilSimpleLineIcon, PlusIcon, XCircleIcon, XIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FC } from "react";
import toast from "react-hot-toast";
import { bulkAddPositionAttributes, removePositionAttribute, type PositionWithAttributes } from "./api";

export const PositionAttributes: FC<{
  position: PositionWithAttributes;
}> = ({ position }) => {
  const [editing, setEditing] = useState(false);

  const queryClient = useQueryClient();
  const createDialog = useDialogState();

  const removeAttrMutation = useMutation({
    mutationFn: (attributeId: string) => removePositionAttribute(position.id, attributeId),
    onSuccess: (data) => {
      queryClient.setQueryData(["positions", position.id], data);
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      toast.success("Attribute removed");
    },
    onError: () => {
      toast.error("Failed to remove attribute");
    },
  });

  const addAttrsMutation = useMutation({
    mutationFn: (ids: string[]) => bulkAddPositionAttributes(position.id, ids),
    onSuccess: (data) => {
      queryClient.setQueryData(["positions", position.id], data);
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      createDialog.closeDialog();
      toast.success("Attribute added");
    },
    onError: () => {
      toast.error("Failed to add attribute");
    },
  });

  const handleDeleteAttribute = (attributeId: string) => {
    removeAttrMutation.mutate(attributeId);
  };

  const handleAddAttributes = async (ids: string[]) => {
    await addAttrsMutation.mutateAsync(ids);
  };

  const disabledRows = useMemo(() => {
    return position.attributes.reduce(
      (result, item) => {
        result[item.attributeId] = true;
        return result;
      },
      {} as Record<string, boolean>,
    );
  }, [position.attributes]);

  return !editing ? (
    <div className="mt-8 border-t pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide">Required Attributes</h2>
        <Can I="update" a="Position">
          <Button variant="link" onClick={() => setEditing(true)} className="-my-2">
            <PencilSimpleLineIcon />
            Edit
          </Button>
        </Can>
      </div>
      {position.attributes.length > 0 ? (
        <dl className="mt-4 space-y-3">
          {position.attributes.map((pa) => (
            <div key={pa.id} className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted-foreground shrink-0">{pa.attribute.name}</dt>
              <span className="flex-1 border-b border-dotted border-border" />
              <dd className="text-sm font-medium">
                <Badge variant="info" className="text-xs">
                  {pa.attribute.type}
                </Badge>
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">No attributes assigned to this position.</p>
      )}
    </div>
  ) : (
    <>
      <div className="mt-8 border-t pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide">Required Attributes</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              className="-my-2"
              loading={addAttrsMutation.isPending}
              onClick={createDialog.openDialog}
            >
              <PlusIcon />
              Add
            </Button>
            <Button variant="link" onClick={() => setEditing(false)} className="-my-2">
              <XIcon />
              Cancel
            </Button>
          </div>
        </div>
        {position.attributes.length > 0 ? (
          <dl className="mt-4 space-y-3">
            {position.attributes.map((pa) => (
              <div key={pa.id} className="flex items-center justify-between gap-4">
                <dt className="text-sm text-muted-foreground shrink-0">{pa.attribute.name}</dt>
                <span className="flex-1 border-b border-dotted border-border" />
                <dd className="flex items-center gap-2">
                  <Badge variant="info" className="text-xs">
                    {pa.attribute.type}
                  </Badge>
                  <Button
                    size="icon-sm"
                    variant="destructive-outline"
                    type="button"
                    onClick={() => handleDeleteAttribute(pa.attributeId)}
                    loading={removeAttrMutation.isPending && removeAttrMutation.variables === pa.attributeId}
                  >
                    <XCircleIcon className="size-4" />
                  </Button>
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No attributes assigned to this position.</p>
        )}
      </div>

      <AttributePicker open={createDialog.open} onOpenChange={createDialog.setOpen} onSelect={handleAddAttributes} disabledRows={disabledRows} />
    </>
  );
};
