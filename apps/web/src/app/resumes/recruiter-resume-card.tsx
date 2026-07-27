import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import type { ResumeListItem } from "./api";

export const RecruiterResumeCard = ({ resume }: { resume: Omit<ResumeListItem, "attributes"> }) => {
  return (
    <div className="group relative rounded-2xl border bg-card p-5 transition-all hover:shadow-md hover:border-foreground/15">
      <Link to={`/resumes/${resume.id}`} className="block">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={resume.user.avatar ?? undefined} alt={resume.user.name ?? "Avatar"} />
            <AvatarFallback>{(resume.user.name ?? "U").charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-brand transition-colors truncate">{resume.user.name ?? "Unnamed"}</h3>
            <p className="text-xs text-muted-foreground truncate">{resume.user.email}</p>
          </div>
          <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-brand transition-colors" />
        </div>
        <div className="mt-3">
          <p className="text-sm font-medium text-foreground">{resume.position.title}</p>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{resume.position.description}</p>
        </div>
      </Link>
    </div>
  );
};
