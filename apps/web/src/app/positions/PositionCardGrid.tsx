import { useQuery } from "@tanstack/react-query";
import { fetchPositions } from "./api";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ArchiveIcon, ArrowRightIcon, CopySimpleIcon } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import type { PositionWithAttributes } from "./api";
import type { FC, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { PositionStatus } from "@rh/database/browser";

const PositionCard = ({ position }: { position: PositionWithAttributes }) => {
  const navigate = useNavigate();

  const handleDuplicate = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    navigate("/positions/new", {
      state: {
        original: position,
      },
    });
  };

  return (
    <Link
      to={`/positions/${position.id}`}
      className="group block rounded-2xl border bg-card p-5 transition-all hover:shadow-md hover:border-foreground/15"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-foreground group-hover:text-brand transition-colors">{position.title}</h3>
        <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-brand transition-colors mt-0.5" />
      </div>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{position.description}</p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Badge variant="info">
            {position.attributes.length} {position.attributes.length === 1 ? "attribute" : "attributes"}
          </Badge>
          {position.status === PositionStatus.ARCHIVED ? (
            <Badge variant="secondary">
              <ArchiveIcon className="size-4" /> Archived
            </Badge>
          ) : null}
        </div>
        <Button variant="outline" size="icon" onClick={handleDuplicate}>
          <CopySimpleIcon />
        </Button>
      </div>
    </Link>
  );
};

export const PositionCardGrid: FC<{
  search: string;
}> = ({ search }) => {
  const { data: positions, isLoading } = useQuery({
    queryKey: ["positions", { search }],
    queryFn: () => fetchPositions(search),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  const items = positions?.data ?? [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">No positions yet.</p>
        <p className="text-sm text-muted-foreground mt-1">Create your first position to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((position) => (
        <PositionCard key={position.id} position={position} />
      ))}
    </div>
  );
};
