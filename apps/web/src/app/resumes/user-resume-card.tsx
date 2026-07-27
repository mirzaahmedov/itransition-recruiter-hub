import { ResumeStatusBadge } from "@/components/resume-status";
import { Progress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue } from "@/components/ui/progress";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import type { ResumeListItem } from "./api";

export const UserResumeCard = ({ resume }: { resume: ResumeListItem }) => {
  const filledCount = resume.attributes.filter(
    (ra) =>
      ra.userAttribute.textValue ||
      ra.userAttribute.numberValue != null ||
      ra.userAttribute.booleanValue != null ||
      ra.userAttribute.dateValue ||
      (ra.userAttribute.startDateValue && ra.userAttribute.endDateValue) ||
      ra.userAttribute.choice,
  ).length;

  const totalCount = resume.attributes.length;
  const percentage = totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;

  return (
    <div className="group relative rounded-2xl border bg-card p-5 transition-all hover:shadow-md hover:border-foreground/15">
      <Link to={`/resumes/${resume.id}`} className="block">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-foreground group-hover:text-brand transition-colors">{resume.position.title}</h3>
          <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-brand transition-colors mt-0.5" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{resume.position.description}</p>
        <div className="mt-4 flex justify-between items-center gap-2">
          <ResumeStatusBadge status={resume.status} />
        </div>
        <Progress value={percentage}>
          <div className="flex items-center justify-between gap-2">
            <ProgressLabel></ProgressLabel>
            <ProgressValue>{() => `${filledCount} / ${totalCount}`}</ProgressValue>
          </div>
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        </Progress>
      </Link>
    </div>
  );
};
