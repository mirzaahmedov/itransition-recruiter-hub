"use client";

import { XIcon, UserCirclePlusIcon } from "@phosphor-icons/react";

import { useFileUpload, type FileWithPreview } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { useState, type FC } from "react";
import { Spinner } from "./ui/spinner";

const FileUploadAvatar: FC<{ onSelect: (file: FileWithPreview) => void; isPending: boolean }> = ({ onSelect, isPending }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
    maxFiles: 1,
    multiple: false,
    onFilesAdded(files) {
      onSelect(files[0]);
    },
  });

  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex">
        <Button
          aria-label={previewUrl ? "Change image" : "Upload image"}
          className="relative size-40! overflow-hidden p-0 shadow-none"
          onClick={openFileDialog}
          variant="outline"
        >
          {isPending ? (
            <div aria-hidden="true">
              <Spinner className="size-20" />
            </div>
          ) : previewUrl ? (
            <img alt="Upload preview" className="size-full object-cover" height={64} src={previewUrl} style={{ objectFit: "cover" }} width={64} />
          ) : (
            <div aria-hidden="true">
              <UserCirclePlusIcon className="size-20 opacity-60" />
            </div>
          )}
        </Button>
        {previewUrl && (
          <Button
            aria-label="Remove image"
            className="-top-2 -right-2 absolute size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
            onClick={() => removeFile(files[0]?.id)}
            size="icon"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
        <input {...getInputProps()} aria-label="Upload image file" className="sr-only" tabIndex={-1} />
      </div>
      {fileName && <p className="text-muted-foreground text-xs">{fileName}</p>}
    </div>
  );
};

export default FileUploadAvatar;
