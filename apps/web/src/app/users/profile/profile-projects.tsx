import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDialogState } from "@/hooks/use-dialog-state";
import { LinkIcon, PlusIcon, TrashIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import type { Project, User } from "@rh/database/browser";
import type { CreateProjectPayload } from "@rh/shared/schemas";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState, type FC } from "react";
import { createProject, deleteProject, uploadProjectImage } from "./api";

export const ProfileProjects: FC<{
  editing: boolean;
  user: User;
  projects: Project[];
}> = ({ user, projects: initialProjects, editing }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const [newProject, setNewProject] = useState<CreateProjectPayload>({ name: "", description: "", url: "" });
  const [newProjectImage, setNewProjectImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const projectDialog = useDialogState();

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
    <div className="mt-6">
      {!editing ? (
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Projects</h3>
          </div>
          <div className="mt-4">
            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-start gap-4">
                    {project.image && <img src={project.image} alt={project.name} className="size-16 rounded-lg object-cover shrink-0" />}
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No projects added yet</p>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Projects</h3>

            <div className="flex items-center gap-1">
              <Button variant="secondary" size="sm" onClick={projectDialog.openDialog} className="-my-2">
                <PlusIcon />
                Add
              </Button>
            </div>
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
      )}
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
