import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, HeartIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import type { LikedResume } from "./liked-resumes-popover";

const mockLikedResumes: any[] = [
  {
    id: "like-1",
    userId: "u1",
    resumeId: "r1",
    resume: {
      id: "r1",
      positionId: "p1",
      userId: "u2",
      status: "PUBLISHED",
      attributes: [],
      likes: [],
      position: {
        id: "p1",
        title: "Senior Frontend Engineer",
        description:
          "Build modern web applications with React and TypeScript. You will lead the frontend team and establish best practices across the codebase.",
        status: "ACTIVE",
      } as any,
    },
  },
  {
    id: "like-2",
    userId: "u1",
    resumeId: "r2",
    resume: {
      id: "r2",
      positionId: "p2",
      userId: "u3",
      status: "DRAFT",
      attributes: [],
      likes: [],
      position: {
        id: "p2",
        title: "Backend Developer",
        description: "Design and implement scalable APIs with NestJS and PostgreSQL. Work closely with the infrastructure team.",
        status: "ACTIVE",
        resumes: [],
        attributes: [],
      },
    },
  },
  {
    id: "like-3",
    userId: "u1",
    resumeId: "r3",
    resume: {
      id: "r3",
      positionId: "p3",
      userId: "u4",
      status: "PUBLISHED",
      attributes: [],
      likes: [],
      position: {
        id: "p3",
        title: "DevOps Engineer",
        description: "Maintain CI/CD pipelines and cloud infrastructure. Ensure high availability across all environments.",
        status: "ACTIVE",
        resumes: [],
        attributes: [],
      },
    },
  },
  {
    id: "like-4",
    userId: "u1",
    resumeId: "r4",
    resume: {
      id: "r4",
      positionId: "p4",
      userId: "u5",
      status: "PRIVATE",
      attributes: [],
      likes: [],
      position: {
        id: "p4",
        title: "UI/UX Designer",
        description: "Create intuitive user experiences for web platforms. Collaborate with product and engineering.",
        status: "ARCHIVED",
        resumes: [],
        attributes: [],
      },
    },
  },
];

const LikedResumeCard = ({ like }: { like: LikedResume }) => (
  <div className="group relative rounded-2xl border bg-card p-5 transition-all hover:shadow-md hover:border-foreground/15">
    <Link to={`/resumes/${like.resume.id}`} className="block">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <HeartIcon className="size-4 shrink-0 text-pink-500" weight="fill" />
          <h3 className="font-semibold text-foreground group-hover:text-brand transition-colors">{like.resume.position.title}</h3>
        </div>
        <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-brand transition-colors mt-0.5" />
      </div>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{like.resume.position.description}</p>
      <div className="mt-4 flex items-center gap-2">
        <Badge variant={like.resume.status === "PUBLISHED" ? "success" : "warning"}>{like.resume.status}</Badge>
        <Badge variant={like.resume.position.status === "ACTIVE" ? "info" : "secondary"}>
          {like.resume.position.status === "ACTIVE" ? "Open" : "Archived"}
        </Badge>
      </div>
    </Link>
  </div>
);

const LikedResumesPage = () => {
  const items = mockLikedResumes;

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
            <LikedResumeCard key={like.id} like={like} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedResumesPage;
