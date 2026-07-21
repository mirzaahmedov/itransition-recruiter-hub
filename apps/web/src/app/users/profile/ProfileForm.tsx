import { AttributeEditor } from "@/components/AttributeEditor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDialogState } from "@/hooks/use-dialog-state";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import { useCategoryStore } from "@/store/useCategoryStore";
import { fallbackName } from "@/utils/fallbackName";
import { FloppyDiskIcon, LinkIcon, PlusIcon, TrashIcon, UploadSimpleIcon, WarningCircleIcon, XIcon } from "@phosphor-icons/react";
import type { Project, User } from "@rh/database/browser";
import type { CreateProjectPayload, UpdateUserProfileAttributePayload } from "@rh/shared/schemas";
import { getDynamicDefaultValue, getDynamicValueObject, readDynamicValue } from "@rh/shared/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  bulkUpdateProfileAttributes,
  createBulkUserAttributes,
  createProject,
  deleteProject,
  uploadProfilePicture,
  uploadProjectImage,
  updateUserProfile,
  type BulkUpdateUserAttributeArgs,
  type UserAttributeWithJoins,
} from "./api";
import { AttributePicker } from "../../../components/AttributePicker/AttributePicker";
import { useAutoSave } from "./useAutoSave";
import { Badge } from "@/components/ui/badge";
import FileUploadAvatar from "@/components/FileUploadAvatar";

interface UserAttributeUpdateArgs {
  id: string;
  version: number;
  payload: UpdateUserProfileAttributePayload;
}
interface ProfileFormData {
  attrs: Record<
    string,
    {
      attr: UserAttributeWithJoins;
      value: any;
    }
  >;
}

const ProfileForm: FC<{
  user: User;
  userAttributes: UserAttributeWithJoins[];
  userProjects: Project[];
  onStopEditing: VoidFunction;
}> = ({ user, userAttributes, userProjects, onStopEditing }) => {
  const queryClient = useQueryClient();

  const [name, setName] = useState(user.name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const [conflicts, setConflicts] = useState<Record<string, boolean>>({});
  const [projects, setProjects] = useState<Project[]>(userProjects);
  const [newProject, setNewProject] = useState<CreateProjectPayload>({ name: "", description: "", url: "" });
  const [newProjectImage, setNewProjectImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormData>({
    defaultValues: {
      attrs: {},
    },
  });

  const categories = useCategoryStore((store) => store.categories);
  const createDialog = useDialogState();
  const projectDialog = useDialogState();

  const createUserAttributeMutation = useMutation({
    mutationFn: createBulkUserAttributes,
  });

  const uploadProfilePictureMutation = useMutation({
    mutationFn: (file: File) => uploadProfilePicture(user.id, file),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string }) => updateUserProfile(user.id, data),
  });

  const updateProfileAttributeMutation = useMutation({
    mutationFn: ({ data }: Omit<BulkUpdateUserAttributeArgs, "userId">) =>
      bulkUpdateProfileAttributes({
        userId: user.id,
        data,
      }),
  });

  const createProjectMutation = useMutation({
    mutationFn: (data: CreateProjectPayload) => createProject(user.id, data),
    onSuccess: (res) => {
      if (newProjectImage) {
        uploadProjectImageMutation.mutate({ projectId: res.data.id, file: newProjectImage });
      } else {
        setProjects((prev) => [res.data, ...prev]);
        setNewProject({ name: "", description: "", url: "" });
        setNewProjectImage(null);
        projectDialog.closeDialog();
      }
    },
  });

  const uploadProjectImageMutation = useMutation({
    mutationFn: ({ projectId, file }: { projectId: string; file: File }) => uploadProjectImage(user.id, projectId, file),
    onSuccess: (res) => {
      setProjects((prev) => [res.data, ...prev.filter((p) => p.id !== res.data.id)]);
      setNewProject({ name: "", description: "", url: "" });
      setNewProjectImage(null);
      projectDialog.closeDialog();
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => deleteProject(user.id, projectId),
    onSuccess: (_, projectId) => {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    },
  });

  const handleSave = useCallback(async (values: UserAttributeUpdateArgs[]) => {
    updateProfileAttributeMutation
      .mutateAsync({
        data: values.map((value) => ({
          data: value.payload,
          version: value.version,
          id: value.id,
        })),
      })
      .then((res) => {
        const { concurrent_modification = [], modified } = res?.data ?? {};

        if (concurrent_modification.length) {
          setConflicts(
            concurrent_modification.reduce(
              (result, item) => {
                result[item.id] = true;
                return result;
              },
              {} as typeof conflicts,
            ),
          );
        }

        modified.forEach((item) => {
          form.setValue(`attrs.${item.id}.attr.version`, item.version);
        });
      });
  }, []);
  const { queueUpdate, flush, isSaving } = useAutoSave<UserAttributeUpdateArgs>(handleSave);

  useEffect(() => {
    if (Array.isArray(userAttributes)) {
      form.reset({
        attrs: userAttributes.reduce(
          (result, item) => {
            const value = readDynamicValue(item.attribute.type, item) ?? getDynamicDefaultValue(item.attribute.type);
            result[item.id] = {
              value,
              attr: item,
            };
            return result;
          },
          {} as ProfileFormData["attrs"],
        ),
      });
    } else {
      form.reset({
        attrs: {},
      });
    }
  }, [userAttributes]);

  const handleAvatarUpload = (data: FileWithPreview) => {
    if (data.file instanceof File) {
      uploadProfilePictureMutation.mutate(data.file, {
        onSuccess: (res: any) => {
          if (res?.avatar) {
            setAvatarUrl(res.avatar);
          }
        },
      });
    }
  };

  const handleSaveProfile = async () => {
    const nameChanged = name !== (user.name ?? "");
    if (nameChanged) {
      await updateProfileMutation.mutateAsync({ name });
    }
    await flush();
    queryClient.invalidateQueries({ queryKey: ["users", user.id] });
    onStopEditing();
  };

  const readCategoryAttributes = (categoryId: string) => {
    const attrs = form.watch("attrs");
    return Object.entries(attrs).filter(([, item]) => item.attr.attribute.categoryId === categoryId);
  };

  const handleCreateAttributes = async (attrIds: string[]) => {
    createUserAttributeMutation
      .mutateAsync({
        ids: attrIds,
        userId: user.id,
      })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ["users", user.id, "attributes"],
        });
        createDialog.closeDialog();
      });
  };

  const handleAddProject = () => {
    if (!newProject.name.trim()) return;
    createProjectMutation.mutate(newProject);
  };

  const handleProjectImageUpload = (projectId: string, file: File) => {
    uploadProjectImageMutation.mutate({ projectId, file });
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProjectMutation.mutate(projectId);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="h-32 bg-linear-to-br from-brand/20 via-brand/10 to-transparent" />
        <div className="px-8 pb-8">
          <div className="flex items-end gap-5 -mt-12">
            <FileUploadAvatar onSelect={handleAvatarUpload} isPending={uploadProfilePictureMutation.isPending}>
              <Avatar className="size-24 ring-4 ring-card">
                <AvatarImage src={avatarUrl ?? undefined} alt={name ?? "Avatar"} />
                <AvatarFallback className="text-3xl">{fallbackName(name || "User")}</AvatarFallback>
              </Avatar>
            </FileUploadAvatar>
            <div className="flex-1 pb-1 space-y-1">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-bold h-auto py-0 px-0 border-0 border-b border-transparent focus:border-border rounded-none shadow-none bg-transparent"
                placeholder="Your name"
              />
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <Button loading={isSaving || updateProfileMutation.isPending} onClick={handleSaveProfile}>
                <FloppyDiskIcon />
                Save
              </Button>
              <Button variant="ghost" onClick={onStopEditing}>
                <XIcon />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {categories?.map((category) => {
          const attrs = readCategoryAttributes(category.id);
          return (
            <div key={category.id} className="rounded-2xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{category.name}</h3>
                <Button variant="secondary" size="sm" onClick={createDialog.openDialog}>
                  <PlusIcon />
                  Add
                </Button>
              </div>
              <div className="mt-4">
                {attrs.length > 0 ? (
                  <ul className="space-y-3">
                    {attrs.map(([attrId, attr]) => (
                      <li key={attrId} className="flex items-start justify-between gap-10">
                        <div className="flex items-end w-full max-w-40 shrink-0 gap-4">
                          <span className="text-sm text-muted-foreground">{attr.attr.attribute.name}</span>
                          <span className="flex-1 border-b border-dotted border-border" />
                        </div>
                        <span className="flex-1 w-full ">
                          <span className="max-w-100">
                            <Controller
                              control={form.control}
                              name={`attrs.${attrId}.value`}
                              render={({ field }) => (
                                <AttributeEditor
                                  type={attr.attr.attribute.type}
                                  value={field.value}
                                  onValueChange={(value) => {
                                    queueUpdate({
                                      id: attr.attr.id,
                                      version: attr.attr.version,
                                      payload: getDynamicValueObject(value, attr.attr.attribute.type),
                                    });
                                    field.onChange(value);
                                  }}
                                  choices={(attr.attr.attribute as any).choices ?? []}
                                />
                              )}
                            />
                          </span>
                        </span>
                        <span className="w-20">
                          {conflicts[attr.attr.id] ? (
                            <Badge variant="destructive">
                              <WarningCircleIcon weight="bold" /> Conflict
                            </Badge>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No attributes added yet</p>
                )}
              </div>
            </div>
          );
        })}

        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Projects</h3>
            <Button variant="secondary" size="sm" onClick={projectDialog.openDialog}>
              <PlusIcon />
              Add
            </Button>
          </div>
          <div className="mt-4">
            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-start gap-4">
                    {project.image ? (
                      <img src={project.image} alt={project.name} className="size-16 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="size-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleProjectImageUpload(project.id, file);
                          }}
                          id={`project-image-${project.id}`}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground"
                          onClick={() => document.getElementById(`project-image-${project.id}`)?.click()}
                        >
                          <UploadSimpleIcon className="size-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{project.name}</h4>
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <LinkIcon className="size-3.5" />
                          </a>
                        )}
                      </div>
                      {project.description && <p className="text-sm text-muted-foreground mt-1">{project.description}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No projects added yet</p>
            )}
          </div>
        </div>
      </div>

      <AttributePicker open={createDialog.open} onOpenChange={createDialog.setOpen} onSelect={handleCreateAttributes} />

      {projectDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-2xl border p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Add Project</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Image</label>
                <div className="mt-1 flex items-center gap-3">
                  {newProjectImage ? (
                    <img src={URL.createObjectURL(newProjectImage)} alt="Preview" className="size-16 rounded-lg object-cover" />
                  ) : (
                    <div className="size-16 rounded-lg bg-muted flex items-center justify-center">
                      <UploadSimpleIcon className="size-6 text-muted-foreground" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setNewProjectImage(file);
                    }}
                  />
                  <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                    Choose Image
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={newProject.name}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Project name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newProject.description ?? ""}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value || undefined }))}
                  placeholder="Brief description of the project"
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">URL</label>
                <Input
                  value={newProject.url ?? ""}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, url: e.target.value || undefined }))}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" onClick={projectDialog.closeDialog}>
                Cancel
              </Button>
              <Button onClick={handleAddProject} loading={createProjectMutation.isPending}>
                Add Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
