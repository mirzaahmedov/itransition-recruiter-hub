import { type Placement, useFloating, shift, flip, offset, autoUpdate, useRole, useInteractions, size } from "@floating-ui/react";
import { useState } from "react";

export function useBaseDropdown({ placement }: { placement?: Placement }) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    middleware: [
      shift(),
      flip(),
      offset({
        mainAxis: 10,
      }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    placement,
    whileElementsMounted: autoUpdate,
  });

  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([role]);

  return {
    isOpen,
    setIsOpen,
    getReferenceProps,
    getFloatingProps,
    floatingStyles,
    refs,
    context,
  };
}
