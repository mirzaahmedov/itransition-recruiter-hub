import { Link } from "react-router-dom";
import type { ResumeListItem } from "./api";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { ResumeStatusBadge } from "@/components/resume-status";

export const ResumeCard = ({ resume }: { resume: ResumeListItem }) => {
  const filledCount = resume.resumeAttributes.filter(
    (ra) =>
      ra.userAttribute.textValue ||
      ra.userAttribute.numberValue != null ||
      ra.userAttribute.booleanValue != null ||
      ra.userAttribute.dateValue ||
      (ra.userAttribute.startDateValue && ra.userAttribute.endDateValue) ||
      ra.userAttribute.choice,
  ).length;

  const isValid = filledCount === resume.resumeAttributes.length;

  return (
    <div className="group relative rounded-2xl border bg-card p-5 transition-all hover:shadow-md hover:border-foreground/15">
      <Link to={`/resumes/${resume.id}`} className="block">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-foreground group-hover:text-brand transition-colors">{resume.position.title}</h3>
          <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-brand transition-colors mt-0.5" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{resume.position.description}</p>
        <div className="mt-4 flex items-center gap-2">
          <ResumeStatusBadge status={resume.status} />
          <Badge variant={isValid ? "info" : "destructive"}>
            {filledCount}/{resume.resumeAttributes.length} fields filled
          </Badge>
        </div>
      </Link>
    </div>
  );
};
