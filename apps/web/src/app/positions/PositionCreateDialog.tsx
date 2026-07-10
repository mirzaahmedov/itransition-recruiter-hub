import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@phosphor-icons/react";
import { PositionCreateSchema, type PositionCreatePayload } from "@rh/shared";
import { useForm } from "react-hook-form";

import { AttributePicker } from "@/components/AttributePicker/AttributePicker";
import type { Attribute } from "@rh/database/client";
import { useEffect, useState, type FC } from "react";

export const PositionCreateDialog: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PositionCreatePayload) => void;
  isSubmitting: boolean;
}> = ({ open, onOpenChange, onSubmit, isSubmitting = false }) => {
  const [attrs, setAttrs] = useState<Attribute[]>([]);

  const form = useForm({
    resolver: zodResolver(PositionCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      attributes: [],
    } as PositionCreatePayload,
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({
      ...values,
      attributes: attrs,
    });
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button />}>
        <PlusIcon /> Create
      </DialogTrigger>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Create new attribute</DialogTitle>
        </DialogHeader>
        <Form className="contents" onSubmit={handleSubmit}>
          <DialogPanel className="grid gap-4">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input type="text" {...form.register("title")} />
              <FieldError />
            </Field>

            <Field>
              <FieldLabel>Title</FieldLabel>
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
            <div>
              {attrs.map((attr) => (
                <div key={attr.id}>{attr.name}</div>
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
