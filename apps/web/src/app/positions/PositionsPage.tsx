import { useNavigate } from "react-router-dom";
import { PositionCardGrid } from "./PositionCardGrid";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { Can } from "@casl/react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

const PositionsPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
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
          <Can I="create" a="Position">
            <Button onClick={() => navigate("/positions/new")}>
              <PlusIcon />
              New Position
            </Button>
          </Can>
        </div>
      </div>
      <PositionCardGrid search={debouncedSearch} />
    </div>
  );
};

export default PositionsPage;
