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

import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
} from "@/components/ui/autocomplete";
import { useDialogState } from "@/hooks/use-dialog-state";
import type { Attribute } from "@rh/database/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type FC, type ReactElement } from "react";
import { fetchAttributes } from "../attributes/api";

export const PositionCreateDialog: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PositionCreatePayload) => void;
  isSubmitting: boolean;
  btnRender?: ReactElement;
}> = ({ open, onOpenChange, onSubmit, isSubmitting = false, btnRender = <Button /> }) => {
  const [attrs, setAttrs] = useState<Attribute[]>([]);
  const [inputValue, setInputValue] = useState("");

  const attrsDialog = useDialogState();

  const { data: attrsData } = useQuery({
    queryKey: ["attrs"],
    queryFn: () => fetchAttributes(),
  });

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
      <DialogTrigger render={btnRender}>
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

              <Autocomplete
                open={attrsDialog.open}
                onOpenChange={attrsDialog.setOpen}
                items={attrsData?.data ?? []}
                itemToStringValue={(item) => item.name}
                value={inputValue}
                onValueChange={setInputValue}
                autoHighlight
              >
                <AutocompleteInput aria-label="Search items" placeholder="Search items…" />
                <AutocompletePopup>
                  <AutocompleteEmpty>No items found.</AutocompleteEmpty>
                  <AutocompleteList>
                    {(item: Attribute) => (
                      <AutocompleteItem
                        key={item.id}
                        value={item}
                        onClick={(e) => {
                          e.preventBaseUIHandler();
                          setAttrs((prev) => [...prev, item]);
                          setInputValue("");
                          attrsDialog.closeDialog();
                        }}
                      >
                        {item.name}
                      </AutocompleteItem>
                    )}
                  </AutocompleteList>
                </AutocompletePopup>
              </Autocomplete>
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
