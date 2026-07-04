import Downshift from "downshift";
import type { ReactNode } from "react";
import { useBaseDropdown } from "./BaseDropdown/useBaseDropdown";
import { BaseDropdown } from "./BaseDropdown/BaseDropdown";
import { CaretDownIcon } from "@phosphor-icons/react";

export type SelectProps<T, V = unknown> = {
  placeholder: string;
  items: T[];
  value: NoInfer<V>;
  onChange?: (value: NoInfer<V>) => void;
  onSelectedChange?: (selected: T) => void;
  itemValue: (item: T) => V;
  itemLabel: (item: T) => ReactNode;
};
export const Select = <T extends object, V = unknown>({
  placeholder,
  items,
  value,
  onChange,
  onSelectedChange,
  itemLabel,
  itemValue,
}: SelectProps<T, V>) => {
  const selected = items.find((item) => itemValue(item) === value);

  const dropdown = useBaseDropdown({ placement: "bottom" });

  return (
    <Downshift
      isOpen={dropdown.isOpen}
      onStateChange={(changes) => {
        if (typeof changes.isOpen === "boolean" && changes.type !== Downshift.stateChangeTypes.blurButton) {
          dropdown.setIsOpen(changes.isOpen);
        }
      }}
      onChange={(selected) => {
        onChange?.(itemValue(selected));
        onSelectedChange?.(selected);
      }}
    >
      {({ isOpen, getRootProps, getToggleButtonProps, getItemProps, getMenuProps }) => (
        <>
          <div {...getRootProps({}, { suppressRefError: true })}>
            <button className="input cursor-pointer" ref={dropdown.refs.setReference} {...dropdown.getReferenceProps()} {...getToggleButtonProps({})}>
              {selected ? itemLabel(selected) : placeholder} <CaretDownIcon className="icon" />
            </button>
          </div>
          <BaseDropdown {...getMenuProps({}, { suppressRefError: true })} control={dropdown}>
            <ul className="overflow-auto p-0 z-10 menu w-full">
              {isOpen &&
                items.map((item, index) => (
                  <li key={`${itemValue(item)}.${index}`}>
                    <button
                      {...getItemProps({
                        item,
                        index,
                      })}
                    >
                      {itemLabel(item)}
                    </button>
                  </li>
                ))}
            </ul>
          </BaseDropdown>
        </>
      )}
    </Downshift>
  );
};
