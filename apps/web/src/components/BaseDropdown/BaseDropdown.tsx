import { FloatingFocusManager, FloatingPortal, useMergeRefs } from "@floating-ui/react";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import type { useBaseDropdown } from "./useBaseDropdown";

export const BaseDropdown = forwardRef<
  HTMLDivElement,
  {
    control: ReturnType<typeof useBaseDropdown>;
    children: ReactNode;
  } & HTMLAttributes<HTMLDivElement>
>(({ control, children, ...props }, menuRef) => {
  const { isOpen, context, refs, floatingStyles, getFloatingProps } = control;

  const ref = useMergeRefs([menuRef, refs.setFloating]);

  return (
    <>
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context}>
            <div
              ref={ref}
              style={floatingStyles}
              className="dropdown bg-base-100 border border-base-content/20 rounded-box shadow-2xl w-full max-w-md h-fit max-h-100 p-5"
              {...getFloatingProps()}
              {...props}
            >
              {children}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
});
