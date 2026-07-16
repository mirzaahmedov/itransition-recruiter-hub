import { fetchSearchAttributes } from "@/components/AttributePicker/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "@phosphor-icons/react";
import type { CategoryGetPayload } from "@rh/database/models";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FC } from "react";

type GroupedAttribute = CategoryGetPayload<{
  include: {
    attrs: true;
  };
}>;

const AttributePicker: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const timerRef = useRef<number>(null);

  const [inputValue, setInputValue] = useState("");

  const [groupedItems, setGroupedItems] = useState<GroupedAttribute[]>();

  const searchAttributeMutation = useMutation({
    mutationFn: fetchSearchAttributes,
  });

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const timeoutId = setTimeout(() => {
      searchAttributeMutation.mutateAsync(inputValue).then((data) => setGroupedItems(data.filter((item) => item.attrs.length > 0)));
    }, 500);
    timerRef.current = timeoutId;

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button />}>
        <PlusIcon /> Create
      </DialogTrigger>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Create new attribute</DialogTitle>
        </DialogHeader>
        <DialogPanel className="grid gap-4">Contents</DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Close</DialogClose>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
};

export default AttributePicker;
