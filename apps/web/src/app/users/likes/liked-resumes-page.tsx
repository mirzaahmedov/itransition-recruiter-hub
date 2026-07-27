import { RecruiterResumeCard } from "@/app/resumes/recruiter-resume-card";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { fetchResumeLikes } from "./api";

const LikedResumesPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["resumeLikes"],
    queryFn: fetchResumeLikes,
  });

  const items = data?.data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Liked Resumes</h1>
        <p className="text-sm text-muted-foreground mt-1">Resumes you've bookmarked for review</p>
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
          {items.map(({ resume }) => (
            <RecruiterResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedResumesPage;
