import { fetchAttributes, type AttributeWithChoices } from "@/app/attributes/api";
import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
} from "@/components/ui/autocomplete";
import { useDialogState } from "@/hooks/use-dialog-state";
import { useQuery } from "@tanstack/react-query";
import { useState, type FC } from "react";

export const AttributePicker: FC<{
  onSelect: (attr: AttributeWithChoices) => void;
}> = ({ onSelect }) => {
  const [inputValue, setInputValue] = useState("");

  const dialog = useDialogState();

  const { data: attrsData } = useQuery({
    queryKey: ["attrs"],
    queryFn: () => fetchAttributes(),
  });

  return (
    <Autocomplete
      open={dialog.open}
      onOpenChange={dialog.setOpen}
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
          {(attr: AttributeWithChoices) => (
            <AutocompleteItem
              key={attr.id}
              value={attr}
              onClick={(e) => {
                e.preventBaseUIHandler();
                onSelect(attr);
                setInputValue("");
                dialog.closeDialog();
              }}
            >
              {attr.name}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompletePopup>
    </Autocomplete>
  );
};
