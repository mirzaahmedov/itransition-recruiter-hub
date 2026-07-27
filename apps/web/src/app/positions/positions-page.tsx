import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Can } from "@casl/react";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { type FindAllPositionParamsPayload } from "@rh/shared/schemas";
import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SortBy, SortOrder } from "./api";
import { PositionCardGrid } from "./position-card-grid";

const sortOptions: Array<{
  value: `${FindAllPositionParamsPayload["sortBy"]}:${FindAllPositionParamsPayload["sortOrder"]}`;
  label: string;
}> = [
  {
    value: "createdAt:desc",
    label: "Newest",
  },
  {
    value: "createdAt:asc",
    label: "Oldest",
  },
  {
    value: "title:desc",
    label: "Name Z-A",
  },
  {
    value: "title:asc",
    label: "Name A-Z",
  },
  {
    value: "resumes:desc",
    label: "Most popular",
  },
  {
    value: "resumes:asc",
    label: "Least popular",
  },
];

const PositionsPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const debouncedSearch = useDebounce(search, 500);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center flex-wrap gap-5 justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Positions</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse and manage job positions</p>
        </div>
        <div className="flex items-center gap-2">
          <InputGroup className="max-w-60">
            <InputGroupInput size="lg" aria-label="Search" placeholder="Search" type="search" value={search} onValueChange={setSearch} />
            <InputGroupAddon>
              <MagnifyingGlassIcon aria-hidden="true" />
            </InputGroupAddon>
          </InputGroup>
          <Select
            items={sortOptions}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = (value ?? ":")?.split(":") as [SortBy, SortOrder];
              setSortBy(sortBy);
              setSortOrder(sortOrder);
            }}
            value={`${sortBy}:${sortOrder}`}
          >
            <SelectTrigger aria-label="Select result range" className="w-fit min-w-none" size="lg">
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
          <Can I="create" a="Position">
            <Button onClick={() => navigate("/positions/new")}>
              <PlusIcon />
              Create
            </Button>
          </Can>
        </div>
      </div>
      <PositionCardGrid search={debouncedSearch} sortBy={sortBy} sortOrder={sortOrder} />
    </div>
  );
};

export default PositionsPage;
