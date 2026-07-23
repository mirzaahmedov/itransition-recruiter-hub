import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { createPosition, type PositionWithAttributes } from "./api";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, FloppyDiskIcon, PlusIcon, XCircleIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePositionSchema, type CreatePositionPayload } from "@rh/shared";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AttributePicker } from "@/components/AttributePicker/AttributePicker";
import { useDialogState } from "@/hooks/use-dialog-state";
import type { Attribute } from "@rh/database/browser";
import { Badge } from "@/components/ui/badge";

const PositionCreatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createDialog = useDialogState();

  const [selectedAttributes, setSelectedAttributes] = useState<Attribute[]>([]);

  const original = location.state?.original as PositionWithAttributes;

  const form = useForm<CreatePositionPayload>({
    resolver: zodResolver(CreatePositionSchema),
    defaultValues: {
      title: "",
      description: "",
      attributes: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: createPosition,
    onSuccess: (data) => {
      toast.success("Position created");
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      navigate(`/positions/${data.data.id}`);
    },
    onError: () => {
      toast.error("Failed to create position");
    },
  });

  const handleSave = form.handleSubmit(async (values) => {
    await createMutation.mutateAsync({ ...values, attributes: selectedAttributes.map((a) => ({ id: a.id })) });
  });

  const handleAddAttributes = async (_values: string[], data: Attribute[]) => {
    setSelectedAttributes((prev) => [...prev, ...data]);
    createDialog.closeDialog();
  };

  const handleRemoveAttribute = (attributeId: string) => {
    setSelectedAttributes((prev) => prev.filter((a) => a.id !== attributeId));
  };

  const disabledRows = selectedAttributes.reduce(
    (result, attr) => {
      result[attr.id] = true;
      return result;
    },
    {} as Record<string, boolean>,
  );

  useEffect(() => {
    if (original) {
      form.reset({
        title: original.title,
        description: original.description,
        attributes: original.attributes.map((a) => ({ id: a.id })),
      });
      setSelectedAttributes(original.attributes.map((a) => a.attribute));
    } else {
      form.reset({
        title: "",
        description: "",
        attributes: [],
      });
      setSelectedAttributes([]);
    }
  }, [form, original]);

  console.log({ original });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Button variant="ghost" onClick={() => navigate("/positions")} className="mb-6">
        <ArrowLeftIcon className="size-4" />
        Back to positions
      </Button>

      <div className="rounded-2xl border bg-card p-8">
        <Form className="contents" onSubmit={handleSave}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Create new position</h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button loading={createMutation.isPending} type="submit">
                <FloppyDiskIcon />
                Save
              </Button>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input type="text" {...form.register("title")} />
              <FieldError />
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea {...form.register("description")} rows={3} />
              <FieldError />
            </Field>
          </div>

          <div className="mt-8 border-t pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide">Required Attributes</h2>
              <Button variant="secondary" size="sm" type="button" onClick={createDialog.openDialog}>
                <PlusIcon />
                Add
              </Button>
            </div>
            {selectedAttributes.length > 0 ? (
              <dl className="mt-4 space-y-3">
                {selectedAttributes.map((attr) => (
                  <div key={attr.id} className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-muted-foreground shrink-0">{attr.name}</dt>
                    <span className="flex-1 border-b border-dotted border-border" />
                    <dd className="flex items-center gap-2">
                      <Badge variant="info" className="text-xs">
                        {attr.type}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(attr.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <XCircleIcon className="size-4" />
                      </button>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No attributes selected. Click "Add" to choose attributes.</p>
            )}
          </div>

          <AttributePicker open={createDialog.open} onOpenChange={createDialog.setOpen} onSelect={handleAddAttributes} disabledRows={disabledRows} />
        </Form>
      </div>
    </div>
  );
};

export default PositionCreatePage;
