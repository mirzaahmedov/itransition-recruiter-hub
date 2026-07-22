import { Dialog, DialogClose, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { XIcon } from "@phosphor-icons/react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AttributeTypeSelectItems } from "./data";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateAttributeSchema, type CreateAttributePayload } from "@rh/shared/schemas";

import { useEffect, useMemo, useState, type FC, type ReactNode } from "react";
import { AttributeType } from "@rh/database/enums";
import { useCategories } from "../categories/useCategories";
import { z } from "zod";

export const AttibuteCreateDialog: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateAttributePayload) => void;
  isSubmitting: boolean;
  trigger?: ReactNode;
}> = ({ open, onOpenChange, onSubmit, isSubmitting = false, trigger }) => {
  const categories = useCategories();

  const [formErrors, setFormErrors] = useState<Record<string, string | string[]>>({});

  const form = useForm({
    defaultValues: {
      name: "",
      type: "TEXT",
      categoryId: "",
      choices: [],
    } as CreateAttributePayload,
  });

  const choicesArray = useFieldArray({
    control: form.control,
    name: "choices",
  });

  const handleSubmit = form.handleSubmit((values) => {
    const result = CreateAttributeSchema.safeParse(values);
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

  const categoryOptions = useMemo(() => {
    return categories.map((c) => ({
      label: c.name,
      value: c.id,
    }));
  }, [categories]);

  console.log({ formErrors });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Create new attribute</DialogTitle>
        </DialogHeader>
        <Form className="contents" onSubmit={handleSubmit} errors={formErrors}>
          <DialogPanel className="grid gap-4">
            <Field>
              <FieldLabel>Category</FieldLabel>
              <Controller
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    name={field.name}
                    inputRef={field.ref}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={field.disabled}
                    items={categoryOptions}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectPopup>
                      {categoryOptions.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </Select>
                )}
              />
              <FieldError />
            </Field>

            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input type="text" {...form.register("name")} />
              <FieldError />
            </Field>

            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Type</FieldLabel>
                  <Select
                    name={field.name}
                    items={AttributeTypeSelectItems}
                    inputRef={field.ref}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={field.disabled}
                  >
                    <SelectTrigger onBlur={field.onBlur}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectPopup>
                      {AttributeTypeSelectItems.map((option) => (
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

            {form.watch("type") === AttributeType.CHOICE && (
              <Field>
                <FieldLabel>Choices</FieldLabel>
                <Input
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();

                      choicesArray.append({
                        value: e.currentTarget.value,
                      });

                      e.currentTarget.value = "";
                    }
                  }}
                />
                <ul className="w-full divide-y">
                  {choicesArray.fields.map((choice) => (
                    <li key={choice.value}>
                      <div className="flex items-center gap-2 py-1">
                        <p className="flex-1 text-sm">{choice.value}</p>
                        <Button size="icon-xs" variant="destructive-outline">
                          <XIcon />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </Field>
            )}
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
