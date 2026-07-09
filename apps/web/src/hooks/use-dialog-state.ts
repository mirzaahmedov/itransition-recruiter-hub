import { useCallback, useState } from "react";

export const useDialogState = (initialState = false) => {
  const [open, setOpen] = useState(initialState);

  const openDialog = useCallback(() => setOpen(true), []);
  const toggleDialog = useCallback(() => setOpen((prev) => !prev), []);
  const closeDialog = useCallback(() => setOpen(false), []);

  return {
    open,
    setOpen,
    openDialog,
    toggleDialog,
    closeDialog,
  };
};
