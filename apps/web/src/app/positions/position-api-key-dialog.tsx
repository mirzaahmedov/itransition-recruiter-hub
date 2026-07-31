import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { CopySimpleIcon } from "@phosphor-icons/react";
import { useState, type FC } from "react";
import toast from "react-hot-toast";

export const PositionApiKeyDialog: FC<{ open: boolean; onOpenChange: (open: boolean) => void; apiKey: string | undefined }> = ({
  open,
  onOpenChange,
  apiKey,
}) => {
  const [coping, setCoping] = useState(false);

  const handleCopyClipboard = () => {
    setCoping(true);
    window.navigator.clipboard
      .writeText(apiKey!)
      .then(() => toast.success("Copied to the clipboard"))
      .catch(() => toast.error("Unable to copy to the clipboard"))
      .finally(() => setCoping(false));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Keep this key safe!</DialogTitle>
          <DialogDescription>
            For security reasons, this is the only time you'll see this API key. Make sure to copy and save it somewhere secure before closing this
            modal.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel>
          <Field>
            <FieldLabel>API key</FieldLabel>
            <InputGroup>
              <InputGroupInput readOnly value={apiKey ?? ""} />
              <InputGroupAddon align="inline-end">
                <Button loading={coping} variant="outline" onClick={handleCopyClipboard}>
                  <CopySimpleIcon />
                  Copy
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Done</DialogClose>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
};
