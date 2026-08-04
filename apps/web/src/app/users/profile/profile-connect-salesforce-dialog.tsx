import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateSalesforceSchema, type CreateSalesforcePayload } from "@rh/shared/schemas";
import { Controller, useForm } from "react-hook-form";

import type { DialogTriggerProps } from "@base-ui/react";
import { useEffect, useState, type FC } from "react";
import { z } from "zod";

export const ProfileConnectSalesforceDialog: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateSalesforcePayload) => void;
  isSubmitting: boolean;
  trigger?: DialogTriggerProps["render"];
  defaultValues: Partial<CreateSalesforcePayload>;
}> = ({ open, onOpenChange, onSubmit, isSubmitting = false, trigger, defaultValues }) => {
  const [formErrors, setFormErrors] = useState<Record<string, string | string[]>>({});

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      title: "",
      ...defaultValues,
    } as CreateSalesforcePayload,
  });

  const handleSubmit = form.handleSubmit((values) => {
    const result = CreateSalesforceSchema.safeParse(values);
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

  console.log({ values: form.watch() });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={trigger}></DialogTrigger>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Create new attribute</DialogTitle>
        </DialogHeader>
        <Form className="contents" onSubmit={handleSubmit} errors={formErrors}>
          <DialogPanel className="grid gap-4">
            <Field>
              <FieldLabel>First name</FieldLabel>
              <Controller control={form.control} name="firstName" render={({ field }) => <Input {...field} />} />
              <FieldError />
            </Field>
            <Field>
              <FieldLabel>Last name</FieldLabel>
              <Controller control={form.control} name="lastName" render={({ field }) => <Input {...field} />} />
              <FieldError />
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Controller control={form.control} name="email" render={({ field }) => <Input {...field} />} />
              <FieldError />
            </Field>
            <Field>
              <FieldLabel>Phone</FieldLabel>
              <Controller control={form.control} name="phone" render={({ field }) => <Input {...field} />} />
              <FieldError />
            </Field>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Controller control={form.control} name="title" render={({ field }) => <Input {...field} />} />
              <FieldError />
            </Field>
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
