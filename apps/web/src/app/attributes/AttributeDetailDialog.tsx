import { useState, useEffect, type FC } from "react";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { UpdateAttributeSchema, type UpdateAttributePayload } from "@rh/shared/schemas";
import { z } from "zod";
import type { AttributeWithUsage } from "./api";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TrashIcon } from "@phosphor-icons/react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attribute: AttributeWithUsage | null;
  onRename: (id: string, payload: UpdateAttributePayload) => void;
  onDelete: (id: string) => void;
  isRenaming: boolean;
  isDeleting: boolean;
};

const usageCount = (attr: AttributeWithUsage) => {
  return (attr._count?.values ?? 0) + (attr._count?.positionAttributes ?? 0);
};

export const AttributeDetailDialog: FC<Props> = ({
  open,
  onOpenChange,
  attribute,
  onRename,
  onDelete,
  isRenaming,
  isDeleting,
}) => {
  const [formErrors, setFormErrors] = useState<Record<string, string | string[]>>({});

  const form = useForm<UpdateAttributePayload>({
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (attribute && open) {
      form.reset({ name: attribute.name });
    }
  }, [attribute, open]);

  if (!attribute) return null;

  const isUsed = usageCount(attribute) > 0;

  const handleSubmit = form.handleSubmit((values) => {
    const result = UpdateAttributeSchema.safeParse(values);
    if (!result.success) {
      setFormErrors(z.flattenError(result.error).fieldErrors);
      return;
    }
    onRename(attribute.id, values);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>{attribute.name}</DialogTitle>
        </DialogHeader>
        <Form className="contents" onSubmit={handleSubmit} errors={formErrors}>
          <DialogPanel className="grid gap-4">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input type="text" {...form.register("name")} />
              <FieldError />
            </Field>
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Close</DialogClose>
            <AlertDialog>
              <AlertDialogTrigger
                disabled={isUsed}
                render={
                  <Button
                    variant="destructive-outline"
                    disabled={isUsed}
                    title={isUsed ? "Cannot delete an attribute that is in use" : undefined}
                  >
                    <TrashIcon />
                    Delete
                  </Button>
                }
              />
              <AlertDialogPopup>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete attribute</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <strong>{attribute.name}</strong>? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogClose render={<Button variant="ghost" />}>
                    Cancel
                  </AlertDialogClose>
                  <AlertDialogClose
                    render={<Button variant="destructive" loading={isDeleting} />}
                    onClick={() => onDelete(attribute.id)}
                  >
                    Delete
                  </AlertDialogClose>
                </AlertDialogFooter>
              </AlertDialogPopup>
            </AlertDialog>
            <Button loading={isRenaming} type="submit">
              Save
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};
