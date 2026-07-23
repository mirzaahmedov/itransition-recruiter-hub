import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Can } from "@casl/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FloppyDiskIcon, PencilSimpleLineIcon, XIcon } from "@phosphor-icons/react";
import { UpdatePositionSchema, type UpdatePositionPayload } from "@rh/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { updatePosition, type PositionWithAttributes } from "./api";

export const PositionHeader: FC<{
  position: PositionWithAttributes;
}> = ({ position }) => {
  const [editing, setEditing] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<UpdatePositionPayload>({
    resolver: zodResolver(UpdatePositionSchema),
    defaultValues: {
      title: position.title,
      description: position.description,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdatePositionPayload) => updatePosition(position.id, payload),
  });

  const handleSave = form.handleSubmit(async (values) => {
    await updateMutation.mutateAsync(values);
    toast.success("Position updated");
    queryClient.invalidateQueries({ queryKey: ["positions"] });
    setEditing(false);
  });

  return !editing ? (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{position.title}</h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">{position.description}</p>
      </div>
      <div className="flex items-center gap-1">
        <Can I="update" a="Position">
          <Button variant="link" onClick={() => setEditing(true)}>
            <PencilSimpleLineIcon />
            Edit
          </Button>
        </Can>
      </div>
    </div>
  ) : (
    <Form className="contents" onSubmit={handleSave}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-4">
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
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <Button loading={updateMutation.isPending} type="submit">
            <FloppyDiskIcon />
            Save
          </Button>
          <Button variant="link" onClick={() => setEditing(false)} className="-my-2">
            <XIcon />
            Cancel
          </Button>
        </div>
      </div>
    </Form>
  );
};
