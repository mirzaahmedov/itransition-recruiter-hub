import { useNavigate } from "react-router-dom";
import { PositionCardGrid } from "./PositionCardGrid";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react";

const PositionsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Positions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and manage job positions
          </p>
        </div>
        <Button onClick={() => navigate("/positions/new")}>
          <PlusIcon />
          New Position
        </Button>
      </div>
      <PositionCardGrid />
    </div>
  );
};

export default PositionsPage;
