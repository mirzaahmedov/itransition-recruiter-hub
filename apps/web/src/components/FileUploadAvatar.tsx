import { CameraIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { useFileUpload, type FileWithPreview } from "@/hooks/use-file-upload";
import type { FC, PropsWithChildren } from "react";
import { Spinner } from "./ui/spinner";

export type FileUploadAvatarProps = PropsWithChildren<{
  onSelect: (file: FileWithPreview) => void;
  isPending: boolean;
}>;

const FileUploadAvatar: FC<FileUploadAvatarProps> = ({ onSelect, isPending, children }) => {
  const [, { openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
    maxFiles: 1,
    multiple: false,
    onFilesAdded(files) {
      if (files.length > 0) {
        onSelect(files[0]);
      }
    },
  });

  return (
    <div className="relative">
      {children}
      <input {...getInputProps()} aria-label="Upload image file" className="sr-only" tabIndex={-1} />
      {isPending ? (
        <div className="absolute inset-0 bg-black/40 rounded-full grid place-items-center">
          <Spinner />
        </div>
      ) : (
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            console.log("clicked");
            openFileDialog();
          }}
          className="absolute -bottom-1 -right-1 z-10 bg-card!"
        >
          <CameraIcon />
        </Button>
      )}
    </div>
  );
};

export default FileUploadAvatar;
