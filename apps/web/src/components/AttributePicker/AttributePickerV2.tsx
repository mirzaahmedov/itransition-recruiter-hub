import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { ArrowDownIcon, ArrowUpIcon } from "@phosphor-icons/react";
import { CornerDownLeftIcon } from "lucide-react";
import { useEffect, useRef, useState, type FC } from "react";
import { Fragment } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import type { Attribute, Category } from "@rh/database/browser";
import type { CategoryGetPayload } from "@rh/database/models";
import { useMutation } from "@tanstack/react-query";
import { fetchSearchAttributes } from "./api";

type GroupedAttribute = CategoryGetPayload<{
  include: {
    attrs: true;
  };
}>;

export const AttributePicker: FC<{
  onSelect: (attr: Attribute) => void;
}> = ({ onSelect }) => {
  const timerRef = useRef<number>(null);

  const [open, setOpen] = useState(false);
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
    <CommandDialog onOpenChange={setOpen} open={open}>
      <CommandDialogTrigger render={<Button variant="outline" />}>
        Open Command Palette
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>J</Kbd>
        </KbdGroup>
      </CommandDialogTrigger>
      <CommandDialogPopup>
        <Command items={groupedItems} value={inputValue} onValueChange={setInputValue}>
          <CommandInput placeholder="Search for apps and commands..." />
          <CommandPanel>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandList>
              {(group: GroupedAttribute, _index: number) => (
                <Fragment key={group.id}>
                  <CommandGroup items={group.attrs}>
                    <CommandGroupLabel>{group.name}</CommandGroupLabel>
                    <CommandCollection>
                      {(item: Attribute) => (
                        <CommandItem
                          key={item.id}
                          onClick={() => {
                            onSelect(item);
                            setOpen(false);
                          }}
                          value={item.id}
                        >
                          <span className="flex-1">{item.name}</span>
                          {/* {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>} */}
                        </CommandItem>
                      )}
                    </CommandCollection>
                  </CommandGroup>
                  <CommandSeparator />
                </Fragment>
              )}
            </CommandList>
          </CommandPanel>
          <CommandFooter>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>
                    <ArrowUpIcon />
                  </Kbd>
                  <Kbd>
                    <ArrowDownIcon />
                  </Kbd>
                </KbdGroup>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <Kbd>
                  <CornerDownLeftIcon />
                </Kbd>
                <span>Open</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Kbd>Esc</Kbd>
              <span>Close</span>
            </div>
          </CommandFooter>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
};
