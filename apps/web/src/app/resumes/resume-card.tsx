import type { ResumeListItem } from "./api";
import { RecruiterResumeCard } from "./recruiter-resume-card";
import { UserResumeCard } from "./user-resume-card";
import type { FC } from "react";

export const ResumeCard: FC<{
  view?: "user" | "recruiter";
  resume: ResumeListItem;
}> = ({ view = "recruiter", resume }) => {
  return view === "user" ? <UserResumeCard resume={resume} /> : <RecruiterResumeCard resume={resume} />;
};
