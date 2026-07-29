import { Dialog, DialogClose, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateSupportTicketSchema, type CreateSupportTicketPayload } from "@rh/shared/schemas";

import { useEffect, useState, type FC } from "react";
import { z } from "zod";
import type { DialogTriggerProps } from "@base-ui/react";

const priorityOptions = [
  { value: "LOW", label: "Low" },
  { value: "AVERAGE", label: "Average" },
  { value: "HIGH", label: "High" },
];

export const SupportTicketDialog: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateSupportTicketPayload) => void;
  isSubmitting: boolean;
  positionTitle?: string;
  trigger?: DialogTriggerProps["render"];
}> = ({ open, onOpenChange, onSubmit, isSubmitting = false, positionTitle, trigger }) => {
  const [formErrors, setFormErrors] = useState<Record<string, string | string[]>>({});

  const form = useForm({
    defaultValues: {
      title: "",
      link: "",
      priority: "AVERAGE",
    } as CreateSupportTicketPayload,
  });

  const handleSubmit = form.handleSubmit((values) => {
    values.link = window.location.href;
    const result = CreateSupportTicketSchema.safeParse(values);
    if (!result.success) {
      setFormErrors(z.flattenError(result.error).fieldErrors);
      return;
    }
    onSubmit(values);
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={trigger}></DialogTrigger>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Create support ticket</DialogTitle>
        </DialogHeader>
        <Form className="contents" onSubmit={handleSubmit} errors={formErrors}>
          <DialogPanel className="grid gap-4">
            {positionTitle && (
              <Field>
                <FieldLabel>Position</FieldLabel>
                <Input type="text" value={positionTitle} disabled />
              </Field>
            )}
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input type="text" {...form.register("title")} placeholder="Brief description of the issue" />
              <FieldError />
            </Field>
            <Controller
              control={form.control}
              name="priority"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Priority</FieldLabel>
                  <Select
                    name={field.name}
                    items={priorityOptions}
                    inputRef={field.ref}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={field.disabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectPopup>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </Select>
                  <FieldError />
                </Field>
              )}
            />
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Close</DialogClose>
            <Button loading={isSubmitting} type="submit">
              Send
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};
