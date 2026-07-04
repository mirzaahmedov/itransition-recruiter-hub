import {
  FloatingFocusManager,
  FloatingPortal,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  offset,
  flip,
  autoUpdate,
  type Placement,
} from "@floating-ui/react";
import { cloneElement, useState, type ComponentPropsWithRef, type FC, type ReactElement, type ReactNode } from "react";

export const FloatingPopover: FC<{
  placement?: Placement;
  children: ReactElement<ComponentPropsWithRef<"div">>;
  render: () => ReactNode;
}> = ({ placement, children, render }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      shift(),
      flip(),
      offset({
        mainAxis: 10,
      }),
    ],
    placement,
    whileElementsMounted: autoUpdate,
  });

  const role = useRole(context);
  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([role, click, dismiss]);

  const trigger = cloneElement(children, {
    ref: refs.setReference,
    ...getReferenceProps(),
  });

  return (
    <>
      {trigger}
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="bg-base-100 border border-base-content/20 rounded-box shadow-2xl max-w-md h-fit max-h-100 p-5"
            >
              {render()}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
};
