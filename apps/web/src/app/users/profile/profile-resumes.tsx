import type { ResumeListItem } from "@/app/resumes/api";
import { ResumeCard } from "@/app/resumes/resume-card";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/use-auth-store";
import { UserRole } from "@rh/database/browser";
import type { FC } from "react";

export const ProfileResumes: FC<{
  isLoading: boolean;
  resumes: ResumeListItem[];
}> = ({ isLoading, resumes }) => {
  const user = useAuthStore((store) => store.user);

  return (
    <div className="mt-8">
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : resumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground">No resumes yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} view={user?.role === UserRole.RECRUITER ? "recruiter" : "user"} />
          ))}
        </div>
      )}
    </div>
  );
};
