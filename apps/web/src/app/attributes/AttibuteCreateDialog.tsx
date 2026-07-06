import { Dialog, DialogClose, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { PlusIcon } from "@phosphor-icons/react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AttributeTypeSelectItems } from "./data";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AttributeGetPayload } from "@rh/database/models";

import type { FC } from "react";

type AttributeWithChoice = AttributeGetPayload<{
  include: {
    choices: true;
  };
}>;

const payload = {} as AttributeWithChoice;

console.log({ payload });

export const AttibuteCreateDialog: FC<{
  onSubmit: (values: unknown) => void;
}> = ({ onSubmit }) => {
  const form = useForm({
    // resolver: zodResolver(AttributeCreateSchema),
    defaultValues: {
      name: "",
      type: "",
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values);
  });

  return (
    <Dialog>
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
              <FieldLabel>Name</FieldLabel>
              <Input type="text" {...form.register("name")} />
              <FieldError />
            </Field>
            <Field>
              <FieldLabel>Type</FieldLabel>
              <Select items={AttributeTypeSelectItems}>
                <SelectTrigger>
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
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};
