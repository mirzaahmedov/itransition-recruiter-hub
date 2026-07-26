import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AttributeType } from "@rh/database/enums";
import { CheckIcon, PencilSimpleLineIcon, XIcon } from "@phosphor-icons/react";
import { UpdateAttributeSchema, type UpdateAttributePayload } from "@rh/shared/schemas";
import { useEffect, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import {
  addAttributeChoice,
  fetchAttributeDetail,
  removeAttributeChoice,
  renameAttributeChoice,
  type AttributeDetail,
  type AttributeWithUsage,
} from "./api";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attribute: AttributeWithUsage | null;
  onRename: (id: string, payload: UpdateAttributePayload) => void;
  isRenaming: boolean;
};

export const AttributeDetailDialog: FC<Props> = ({ open, onOpenChange, attribute, onRename, isRenaming }) => {
  const [formErrors, setFormErrors] = useState<Record<string, string | string[]>>({});
  const [newChoiceValue, setNewChoiceValue] = useState("");
  const [editingChoiceId, setEditingChoiceId] = useState<string | null>(null);
  const [editingChoiceValue, setEditingChoiceValue] = useState("");

  const queryClient = useQueryClient();

  const form = useForm<UpdateAttributePayload>({
    defaultValues: { name: "" },
  });

  const { data: detail } = useQuery<AttributeDetail | undefined>({
    queryKey: ["attributeDetail", attribute?.id],
    queryFn: () => fetchAttributeDetail(attribute!.id),
    enabled: open && !!attribute?.id,
  });

  const addChoiceMutation = useMutation({
    mutationFn: () => addAttributeChoice(attribute!.id, { value: newChoiceValue }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["attributeDetail", attribute?.id] });
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      setNewChoiceValue("");
      toast.success("Choice added");
    },
    onError(error: any) {
      toast.error(error?.response?.data?.message || "Failed to add choice");
    },
  });

  const renameChoiceMutation = useMutation({
    mutationFn: ({ choiceId, value }: { choiceId: string; value: string }) => renameAttributeChoice(attribute!.id, choiceId, { value }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["attributeDetail", attribute?.id] });
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      setEditingChoiceId(null);
      setEditingChoiceValue("");
      toast.success("Choice renamed");
    },
    onError(error: any) {
      toast.error(error?.response?.data?.message || "Failed to rename choice");
    },
  });

  const removeChoiceMutation = useMutation({
    mutationFn: (choiceId: string) => removeAttributeChoice(attribute!.id, choiceId),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["attributeDetail", attribute?.id] });
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success("Choice removed");
    },
    onError(error: any) {
      toast.error(error?.response?.data?.message || "Failed to remove choice");
    },
  });

  useEffect(() => {
    if (attribute && open) {
      form.reset({ name: attribute.name });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewChoiceValue("");
      setEditingChoiceId(null);
      setEditingChoiceValue("");
    }
  }, [attribute, open]);

  if (!attribute) return null;

  const handleSubmit = form.handleSubmit((values) => {
    const result = UpdateAttributeSchema.safeParse(values);
    if (!result.success) {
      setFormErrors(z.flattenError(result.error).fieldErrors);
      return;
    }
    onRename(attribute.id, values);
  });

  const handleAddChoice = () => {
    if (!newChoiceValue.trim()) return;
    addChoiceMutation.mutate();
  };

  const handleRenameChoice = (choiceId: string) => {
    if (!editingChoiceValue.trim()) return;
    renameChoiceMutation.mutate({ choiceId, value: editingChoiceValue });
  };

  const startEditing = (choiceId: string, currentValue: string) => {
    setEditingChoiceId(choiceId);
    setEditingChoiceValue(currentValue);
  };

  const cancelEditing = () => {
    setEditingChoiceId(null);
    setEditingChoiceValue("");
  };

  const isChoiceType = attribute.type === AttributeType.CHOICE;
  const choices = detail?.choices ?? [];

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

            {isChoiceType && (
              <Field>
                <FieldLabel>Choices</FieldLabel>
                <div className="w-full flex gap-2">
                  <Input
                    type="text"
                    placeholder="New choice..."
                    value={newChoiceValue}
                    onChange={(e) => setNewChoiceValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddChoice();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddChoice}
                    loading={addChoiceMutation.isPending}
                    disabled={!newChoiceValue.trim()}
                  >
                    Add
                  </Button>
                </div>
                <ul className="w-full divide-y rounded-md border">
                  {choices.map((choice) => {
                    const isUsed = choice._count.values > 0;
                    const isEditing = editingChoiceId === choice.id;

                    return (
                      <li key={choice.id}>
                        <div className="flex items-center gap-2 px-3 py-2">
                          {isEditing ? (
                            <Input
                              type="text"
                              className="flex-1"
                              value={editingChoiceValue}
                              onChange={(e) => setEditingChoiceValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleRenameChoice(choice.id);
                                }
                                if (e.key === "Escape") {
                                  cancelEditing();
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <p className="flex-1 text-sm">{choice.value}</p>
                          )}
                          {isUsed && !isEditing && <span className="text-xs text-muted-foreground">in use</span>}
                          {!isUsed && (
                            <>
                              {isEditing ? (
                                <>
                                  <Button
                                    size="icon-xs"
                                    variant="ghost"
                                    onClick={() => handleRenameChoice(choice.id)}
                                    loading={renameChoiceMutation.isPending}
                                  >
                                    <CheckIcon />
                                  </Button>
                                  <Button size="icon-xs" variant="ghost" onClick={cancelEditing}>
                                    <XIcon />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button size="icon-xs" variant="ghost" onClick={() => startEditing(choice.id, choice.value)}>
                                    <PencilSimpleLineIcon />
                                  </Button>
                                  <Button
                                    size="icon-xs"
                                    variant="destructive-outline"
                                    onClick={() => removeChoiceMutation.mutate(choice.id)}
                                    loading={removeChoiceMutation.isPending}
                                  >
                                    <XIcon />
                                  </Button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </li>
                    );
                  })}
                  {choices.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground">No choices yet</li>}
                </ul>
              </Field>
            )}
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Close</DialogClose>
            <Button loading={isRenaming} type="submit">
              Save
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};
