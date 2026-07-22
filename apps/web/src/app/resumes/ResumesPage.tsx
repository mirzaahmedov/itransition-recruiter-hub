import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteResume, fetchMyResumes } from "./api";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, TrashIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import type { ResumeListItem } from "./api";
import { useState } from "react";

const ResumeCard = ({ resume }: { resume: ResumeListItem }) => {
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const filledCount = resume.resumeAttributes.filter(
    (ra) =>
      ra.userAttribute.textValue ||
      ra.userAttribute.numberValue != null ||
      ra.userAttribute.booleanValue != null ||
      ra.userAttribute.dateValue ||
      ra.userAttribute.startDateValue ||
      ra.userAttribute.choice,
  ).length;

  return (
    <div className="group relative rounded-2xl border bg-card p-5 transition-all hover:shadow-md hover:border-foreground/15">
      <Link to={`/resumes/${resume.id}`} className="block">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-foreground group-hover:text-brand transition-colors">{resume.position.title}</h3>
          <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-brand transition-colors mt-0.5" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{resume.position.description}</p>
        <div className="mt-4 flex items-center gap-2">
          <Badge variant={resume.status === "PUBLISHED" ? "success" : "warning"}>{resume.status}</Badge>
          <Badge variant="info">
            {filledCount}/{resume.resumeAttributes.length} fields filled
          </Badge>
        </div>
      </Link>
    </div>
  );
};

const ResumesPage = () => {
  const { data: resumes, isLoading } = useQuery({
    queryKey: ["resumes"],
    queryFn: fetchMyResumes,
  });

  const items = resumes?.data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Resumes</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage your submitted resumes</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground">No resumes yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Apply to a position to create your first resume.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumesPage;
