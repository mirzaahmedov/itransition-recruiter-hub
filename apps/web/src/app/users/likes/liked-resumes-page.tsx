import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, HeartIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import type { LikedResume } from "./liked-resumes-popover";
import { useQuery } from "@tanstack/react-query";
import { fetchResumeLikes } from "./api";
import { RecruiterResumeCard } from "@/app/resumes/recruiter-resume-card";

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

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <HeartIcon className="size-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No liked resumes yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Browse resumes and like the ones you're interested in.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((like) => (
            <RecruiterResumeCard key={like.id} resume={like.resume} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedResumesPage;
