import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { Resume, ResumeLike, Position } from "@rh/database/browser";
import { HeartIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export type LikedResume = ResumeLike & {
  resume: Resume & {
    position: Position;
  };
};

const mockLikedResumes: LikedResume[] = [
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
        description: "Build modern web applications with React and TypeScript.",
        status: "ACTIVE",
        resumes: [],
        attributes: [],
      },
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
        description: "Design and implement scalable APIs with NestJS.",
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
        description: "Maintain CI/CD pipelines and cloud infrastructure.",
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
        description: "Create intuitive user experiences for web platforms.",
        status: "ARCHIVED",
        resumes: [],
        attributes: [],
      },
    },
  },
];

export const LikedResumesContent = ({ likes, isLoading, compact = false }: { likes?: LikedResume[]; isLoading?: boolean; compact?: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  const items = likes ?? mockLikedResumes;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <HeartIcon className="size-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No liked resumes yet.</p>
      </div>
    );
  }

  return (
    <div className={compact ? "w-72" : ""}>
      {!compact && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Liked Resumes</h3>
          <Button variant="ghost" size="sm" render={<Link to="/liked-resumes" />}>
            View all
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-1">
        {items.map((like) => (
          <Link
            key={like.id}
            to={`/resumes/${like.resume.id}`}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <HeartIcon className="size-4 shrink-0 text-pink-500" weight="fill" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{like.resume.position.title}</p>
              <p className="text-xs text-muted-foreground truncate">{like.resume.position.description}</p>
            </div>
            <Badge variant={like.resume.status === "PUBLISHED" ? "success" : "warning"} size="sm">
              {like.resume.status}
            </Badge>
          </Link>
        ))}
      </div>
      {compact && items.length > 0 && (
        <div className="mt-2 pt-2 border-t">
          <Button variant="ghost" size="sm" className="w-full" render={<Link to="/liked-resumes" />}>
            View all liked resumes
          </Button>
        </div>
      )}
    </div>
  );
};
