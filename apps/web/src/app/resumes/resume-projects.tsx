import { LinkIcon } from "@phosphor-icons/react";
import type { ResumeProjectGetPayload } from "@rh/database/models";
import { type FC } from "react";

export const ResumeProjects: FC<{
  projects: ResumeProjectGetPayload<{
    include: {
      project: true;
    };
  }>[];
}> = ({ projects }) => {
  return (
    <div className="resume-page">
      <div className="resume-section">
        <h3 className="resume-section-title">Projects</h3>
        <div className="resume-projects">
          {projects.length > 0 ? (
            <div className="resume-projects-list">
              {projects.map(({ id, project }) => (
                <div key={id} className="flex items-start gap-4">
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
    </div>
  );
};
