import FileUploadAvatar from "@/components/FileUploadAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import { fallbackName } from "@/utils/fallbackName";
import { CheckIcon, PencilSimpleLineIcon, XIcon } from "@phosphor-icons/react";
import type { User } from "@rh/database/browser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FC } from "react";
import toast from "react-hot-toast";
import { updateUserProfile, uploadProfilePicture } from "./api";

export const ProfileHeader: FC<{
  user: User;
}> = ({ user }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name ?? "");

  const queryClient = useQueryClient();

  const uploadProfilePictureMutation = useMutation({
    mutationFn: (file: File) => uploadProfilePicture(user.id, file),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string }) => updateUserProfile(user.id, data),
  });

  const handleUploadProfilePicture = (data: FileWithPreview) => {
    if (data.file instanceof File) {
      uploadProfilePictureMutation.mutate(data.file, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["users", user.id] });
          toast.success("Profile picture updated successfully");
        },
      });
    }
  };

  const handleSaveProfile = async () => {
    const nameChanged = name !== (user.name ?? "");
    if (nameChanged) {
      await updateProfileMutation.mutateAsync({ name });
    }
    queryClient.invalidateQueries({ queryKey: ["users", user.id] });
    setEditing(false);
  };

  return !editing ? (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="h-32 bg-linear-to-br from-brand/20 via-brand/10 to-transparent" />
      <div className="px-8 pb-8">
        <div className="flex items-end gap-5 -mt-12">
          <Avatar className="size-24 ring-4 ring-card">
            <AvatarImage src={user.avatar ?? undefined} alt={user.name ?? "Avatar"} />
            <AvatarFallback className="text-3xl">{fallbackName(user.name ?? "User")}</AvatarFallback>
          </Avatar>
          <div className="flex-1 pb-1">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="link" onClick={() => setEditing(true)}>
            <PencilSimpleLineIcon />
            Edit
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="h-32 bg-linear-to-br from-brand/20 via-brand/10 to-transparent" />
      <div className="px-8 pb-8">
        <div className="flex items-end gap-5 -mt-12">
          <FileUploadAvatar onSelect={handleUploadProfilePicture} isPending={uploadProfilePictureMutation.isPending}>
            <Avatar className="size-24 ring-4 ring-card">
              <AvatarImage src={user.avatar ?? undefined} alt={name ?? "Avatar"} />
              <AvatarFallback className="text-3xl">{fallbackName(name || "User")}</AvatarFallback>
            </Avatar>
          </FileUploadAvatar>
          <div className="flex-1 pb-1 space-y-1">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="text-2xl! py-2 font-bold" placeholder="Your name" />
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-2 pb-1">
            <Button loading={updateProfileMutation.isPending} onClick={handleSaveProfile}>
              <CheckIcon />
              Save
            </Button>
            <Button variant="link" onClick={() => setEditing(false)}>
              <XIcon />
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
