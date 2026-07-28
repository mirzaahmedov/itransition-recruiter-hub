import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { useDialogState } from "@/hooks/use-dialog-state";
import { parseApiErrorMessage } from "@/lib/api/error";
import { normalizeUrl } from "@/lib/format/string";
import { Can } from "@casl/react";
import { CameraPlusIcon, ImageIcon, LinkIcon, PlusIcon, TrashIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import type { Project, User } from "@rh/database/browser";
import type { CreateProjectPayload } from "@rh/shared/schemas";
import { CreateProjectSchema } from "@rh/shared/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FC, type SubmitEvent } from "react";
import { Controller, useForm, type UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createProject, deleteProject, uploadProjectImage } from "./api";
import { subject } from "@casl/ability";

export const ProfileProjects: FC<{
  user: User;
  projects: Project[];
}> = ({ user, projects: initialProjects }) => {
  const form = useForm<CreateProjectPayload>({
    defaultValues: {
      name: "",
      description: "",
      url: "",
    },
  });

  const [formErrors, setFormErrors] = useState<Record<string, string | string[]>>({});
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [newProjectImage, setNewProjectImage] = useState<File | null>(null);

  const projectDialog = useDialogState();
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["users", user.id, "projects"],
    });
  };

  const createProjectMutation = useMutation({
    mutationFn: (data: CreateProjectPayload) => createProject(user.id, data, newProjectImage),
    onSuccess: (res) => {
      setProjects((prev) => [res.data, ...prev]);
      form.reset();
      setNewProjectImage(null);
      projectDialog.closeDialog();
      toast.success("Project added");
      invalidateQueries();
    },
    onError: (res) => {
      const message = parseApiErrorMessage(res);
      toast.success(message ?? "Failed to add project");
    },
  });

  const uploadProjectImageMutation = useMutation({
    mutationFn: ({ projectId, file }: { projectId: string; file: File }) => uploadProjectImage(user.id, projectId, file),
    onSuccess: (res) => {
      setProjects((prev) => [res.data, ...prev.filter((p) => p.id !== res.data.id)]);
      form.reset();
      setNewProjectImage(null);
      projectDialog.closeDialog();
      toast.success("Project updated");
      invalidateQueries();
    },
    onError: (res) => {
      const message = parseApiErrorMessage(res);
      toast.success(message ?? "Failed to update project");
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => deleteProject(user.id, projectId),
    onSuccess: (_, projectId) => {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.success("Project deleted");
      invalidateQueries();
    },
    onError: (res) => {
      const message = parseApiErrorMessage(res);
      toast.success(message ?? "Failed to delete project");
    },
  });

  const handleAddProject = () => {
    const values = form.getValues();

    if (values.url) {
      values.url = normalizeUrl(values.url);
    } else {
      delete values.url;
    }

    const result = CreateProjectSchema.safeParse(values);
    if (!result.success) {
      setFormErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    createProjectMutation.mutate(values);
  };

  const handleProjectImageUpload = (projectId: string, file: File) => {
    uploadProjectImageMutation.mutate({ projectId, file });
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProjectMutation.mutate(projectId);
  };

  return (
    <div className="mt-6">
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Projects</h3>

          <div className="flex items-center gap-1">
            <Can I="create" a="Project">
              <Button variant="secondary" size="sm" onClick={projectDialog.openDialog} className="-my-2">
                <PlusIcon />
                Add
              </Button>
            </Can>
          </div>
        </div>
        <div className="mt-4">
          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="flex items-start gap-4">
                  <Can I="update" this={subject("Project", project)}>
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
                          loading={uploadProjectImageMutation.isPending}
                          onClick={() => document.getElementById(`project-image-${project.id}`)?.click()}
                        >
                          <CameraPlusIcon className="size-4" />
                        </Button>
                      </div>
                    )}
                  </Can>
                  <Can not I="update" this={subject("Project", project)}>
                    {project.image ? (
                      <img src={project.image} alt={project.name} className="size-16 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="size-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <ImageIcon className="size-4" />
                      </div>
                    )}
                  </Can>
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
                  <Can I="delete" a="Project">
                    <Button
                      variant="ghost"
                      size="icon"
                      loading={deleteProjectMutation.isPending && deleteProjectMutation.variables === project.id}
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </Can>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No projects added yet</p>
          )}
        </div>
      </div>
      <ProjectDialog
        open={projectDialog.open}
        onOpenChange={projectDialog.setOpen}
        form={form}
        image={newProjectImage}
        formErrors={formErrors}
        onSubmit={handleAddProject}
        onChangeImage={setNewProjectImage}
        isPending={createProjectMutation.isPending}
        resetErrors={() => setFormErrors({})}
      />
    </div>
  );
};

const ProjectDialog: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;

  form: UseFormReturn<CreateProjectPayload>;
  formErrors: Record<string, string | string[]>;
  resetErrors: VoidFunction;

  image: File | null;
  onChangeImage: (image: File | null) => void;

  isPending?: boolean;
  onSubmit: VoidFunction;
}> = ({ open, onOpenChange, onSubmit, isPending, form, formErrors, resetErrors, image, onChangeImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  useEffect(() => {
    if (!open) {
      form.reset();
      resetErrors();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
        </DialogHeader>
        <Form className="contents" onSubmit={handleSubmit} errors={formErrors}>
          <DialogPanel className="grid gap-4">
            <Field>
              <FieldLabel>Image</FieldLabel>
              <div className="mt-1 flex items-center gap-3">
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="Preview" className="size-16 rounded-lg object-cover" />
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
                    if (file) onChangeImage(file);
                  }}
                />
                <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                  Choose Image
                </Button>
              </div>
              <FieldError />
            </Field>

            <Field>
              <FieldLabel className="text-sm font-medium">Name *</FieldLabel>
              <Controller
                control={form.control}
                name="name"
                render={({ field }) => (
                  <Input
                    ref={field.ref}
                    onBlur={field.onBlur}
                    name={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Project name"
                  />
                )}
              />
              <FieldError />
            </Field>
            <Field>
              <FieldLabel className="text-sm font-medium">Description</FieldLabel>
              <Controller
                control={form.control}
                name="description"
                render={({ field }) => (
                  <Textarea
                    ref={field.ref}
                    onBlur={field.onBlur}
                    name={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    rows={3}
                  />
                )}
              />
              <FieldDescription>Brief description of the project</FieldDescription>
            </Field>
            <Field>
              <FieldLabel className="text-sm font-medium">URL</FieldLabel>
              <Controller
                control={form.control}
                name="url"
                render={({ field }) => (
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>https://</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      ref={field.ref}
                      onBlur={field.onBlur}
                      name={field.name}
                      value={field.value ?? undefined}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </InputGroup>
                )}
              />
              <FieldError />
            </Field>
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Close</DialogClose>
            <Button loading={isPending} type="submit">
              Save
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
};
