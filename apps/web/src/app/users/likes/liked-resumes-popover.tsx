import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Resume, ResumeLike, Position } from "@rh/database/browser";
import { HeartIcon, HeartBreakIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { fetchResumeLikes } from "./api";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export type LikedResume = ResumeLike & {
  resume: Resume & {
    position: Position;
  };
};

export const LikesResumesPopover = () => {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["resumeLikes"],
    queryFn: fetchResumeLikes,
  });

  const items = data?.data ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button size="icon" variant="ghost" title="Likes" className="relative" />}>
        <div className="absolute -top-1 -right-1 z-10">
          {isLoading ? (
            <Badge size="sm" className="rounded-full">
              <Spinner className="size-3" />
            </Badge>
          ) : (
            <Badge size="sm" className="rounded-full">
              {items.length}
            </Badge>
          )}
        </div>
        <HeartIcon className="icon" />
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" sideOffset={8} className="w-80">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Liked Resumes</h3>
            <Button variant="ghost" size="sm" render={<Link to="/liked-resumes" />} onClick={() => setOpen(false)}>
              View <ArrowRightIcon className="icon" />
            </Button>
          </div>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <HeartBreakIcon className="size-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No liked resumes yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Browse resumes and like the ones you're interested in.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {items.map((like) => (
                <Link
                  key={like.id}
                  to={`/resumes/${like.resume.id}`}
                  className="group flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 text-sm transition-all hover:shadow-sm hover:border-foreground/15"
                >
                  <Avatar className="size-9">
                    <AvatarImage src={like.resume.user?.avatar ?? undefined} alt={like.resume.user?.name ?? "Avatar"} />
                    <AvatarFallback>{(like.resume.user?.name ?? "U").charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground group-hover:text-brand transition-colors truncate">
                      {like.resume.user?.name ?? "Unnamed"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{like.resume.position.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
