import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdatePositionSchema, type UpdatePositionPayload } from "@rh/shared";
import { useForm } from "react-hook-form";
import { AttributePicker } from "@/components/AttributePicker/AttributePicker";
import type { Attribute } from "@rh/database/client";
import type { PositionGetPayload } from "@rh/database/models";
import { useCallback, useRef, useState, type FC } from "react";

export const PositionUpdateDialog: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UpdatePositionPayload) => void;
  isSubmitting: boolean;
  position: PositionGetPayload<{ include: { attributes: true } }>;
}> = ({ open, onOpenChange, onSubmit, isSubmitting = false, position }) => {
  const [attrs, setAttrs] = useState<Attribute[]>([]);
  const prevOpen = useRef(open);

  const form = useForm({
    resolver: zodResolver(UpdatePositionSchema),
    defaultValues: {
      title: position.title,
      description: position.description,
      attributes: [],
    } as UpdatePositionPayload,
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({
      ...values,
      attributes: [...position.attributes.map((a) => ({ id: a.attributeId })), ...attrs],
    });
  });

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen && !prevOpen.current) {
        form.reset({
          title: position.title,
          description: position.description,
        });
        setAttrs([]);
      }
      prevOpen.current = nextOpen;
      onOpenChange(nextOpen);
    },
    [form, position, onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Edit position</DialogTitle>
        </DialogHeader>
        <Form className="contents" onSubmit={handleSubmit}>
          <DialogPanel className="grid gap-4">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input type="text" {...form.register("title")} />
              <FieldError />
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea {...form.register("description")} />
              <FieldError />
            </Field>
            <Field>
              <FieldLabel>Attribute</FieldLabel>
              <AttributePicker
                onSelect={(attr) => {
                  setAttrs((prev) => [...prev, attr]);
                }}
              />
            </Field>
            <div className="space-y-1">
              {position.attributes.map((a) => (
                <div key={a.id} className="text-sm text-muted-foreground">{a.attributeId}</div>
              ))}
              {attrs.map((attr) => (
                <div key={attr.id} className="text-sm">{attr.name}</div>
              ))}
            </div>
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Close</DialogClose>
            <Button loading={isSubmitting} type="submit">
              Save
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};
