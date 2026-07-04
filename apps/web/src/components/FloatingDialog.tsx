import { autoUpdate, FloatingPortal, useClick, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";
import { cloneElement, useState, type ComponentPropsWithRef, type FC, type ReactElement, type ReactNode } from "react";

export const FloatingDialog: FC<{
  children?: ReactElement<ComponentPropsWithRef<"div">>;
  render: () => ReactNode;
}> = ({ children, render }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getFloatingProps, getReferenceProps } = useInteractions([click, dismiss, role]);

  return (
    <>
      {children
        ? cloneElement(
            children,
            getReferenceProps({
              ref: refs.setReference,
              ...children.props,
            }),
          )
        : null}
      {isOpen && (
        <FloatingPortal>
          <div className="grid place-items-center bg-black/20 fixed inset-0">
            <div
              ref={refs.setFloating}
              {...getFloatingProps()}
              className="bg-base-100 border border-base-content/20 rounded-box shadow-2xl max-w-md h-fit max-h-100 p-5"
            >
              {render()}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
