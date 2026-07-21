import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { deletePosition, fetchPosition, updatePosition, removePositionAttribute, type PositionWithAttributes, applyToPosition } from "./api";
import { fetchPositionResumes } from "@/app/resumes/api";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilSimpleLineIcon, TrashIcon, ArrowLeftIcon, XIcon, FloppyDiskIcon, PlusIcon, XCircleIcon, ReadCvLogoIcon, ArrowRightIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { useDialogState } from "@/hooks/use-dialog-state";
import { useMemo, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdatePositionSchema, type UpdatePositionPayload } from "@rh/shared";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AttributePicker } from "@/components/AttributePicker/AttributePicker";
import type { Attribute } from "@rh/database/browser";
import { addPositionAttribute } from "./api";
import { Link } from "react-router-dom";
import type { ResumeListItem } from "@/app/resumes/api";
import { useAuthStore } from "@/store/useAuthStore";

const PositionView: FC<{
  position: PositionWithAttributes;
  resumes: ResumeListItem[];
  onEdit: VoidFunction;
  onDelete: VoidFunction;
  onApply: VoidFunction;
  userRole: string;
}> = ({ position, resumes, onEdit, onDelete, onApply, userRole }) => {
  const isCandidate = userRole === "CANDIDATE";

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{position.title}</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">{position.description}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button onClick={onEdit} variant="outline">
            <PencilSimpleLineIcon />
            Edit
          </Button>
          <Button variant="destructive-outline" onClick={onDelete}>
            <TrashIcon /> Delete
          </Button>
          {isCandidate && (
            <Button onClick={onApply}>
              <ReadCvLogoIcon />
              Apply
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h2 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide">Required Attributes</h2>
        {position.attributes.length > 0 ? (
          <dl className="mt-4 space-y-3">
            {position.attributes.map((pa) => (
              <div key={pa.id} className="flex items-center justify-between gap-4">
                <dt className="text-sm text-muted-foreground shrink-0">{pa.attribute.name}</dt>
                <span className="flex-1 border-b border-dotted border-border" />
                <dd className="text-sm font-medium">
                  <Badge variant="info" className="text-xs">
                    {pa.attribute.type}
                  </Badge>
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No attributes assigned to this position.</p>
        )}
      </div>

      {resumes.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide">
            Applications ({resumes.length})
          </h2>
          <div className="mt-4 space-y-2">
            {resumes.map((resume) => (
              <Link
                key={resume.id}
                to={`/resumes/${resume.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{resume.user?.name ?? "Unnamed"}</span>
                  <Badge variant={resume.status === "PUBLISHED" ? "success" : "warning"} size="sm">
                    {resume.status}
                  </Badge>
                </div>
                <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const PositionForm: FC<{
  position: PositionWithAttributes;
  onStopEditing: VoidFunction;
}> = ({ position, onStopEditing }) => {
  const queryClient = useQueryClient();
  const createDialog = useDialogState();

  const form = useForm<UpdatePositionPayload>({
    resolver: zodResolver(UpdatePositionSchema),
    defaultValues: {
      title: position.title,
      description: position.description,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdatePositionPayload) => updatePosition(position.id, payload),
  });

  const removeAttrMutation = useMutation({
    mutationFn: (attributeId: string) => removePositionAttribute(position.id, attributeId),
    onSuccess: (data) => {
      queryClient.setQueryData(["positions", position.id], data);
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      toast.success("Attribute removed");
    },
    onError: () => {
      toast.error("Failed to remove attribute");
    },
  });

  const addAttrMutation = useMutation({
    mutationFn: (attributeId: string) => addPositionAttribute(position.id, attributeId),
    onSuccess: (data) => {
      queryClient.setQueryData(["positions", position.id], data);
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      createDialog.closeDialog();
      toast.success("Attribute added");
    },
    onError: () => {
      toast.error("Failed to add attribute");
    },
  });

  const handleSave = form.handleSubmit(async (values) => {
    await updateMutation.mutateAsync(values);
    toast.success("Position updated");
    queryClient.invalidateQueries({ queryKey: ["positions"] });
    onStopEditing();
  });

  const handleDeleteAttribute = (attributeId: string) => {
    removeAttrMutation.mutate(attributeId);
  };

  const handleAddAttributes = async (_values: string[], data: Attribute[]) => {
    for (const attr of data) {
      await addAttrMutation.mutateAsync(attr.id);
    }
  };

  const disabledRows = useMemo(() => {
    return position.attributes.reduce(
      (result, item) => {
        result[item.id] = true;
        return result;
      },
      {} as Record<string, boolean>,
    );
  }, [position.attributes]);

  return (
    <Form className="contents" onSubmit={handleSave}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-4">
          <Field>
            <FieldLabel>Title</FieldLabel>
            <Input type="text" {...form.register("title")} />
            <FieldError />
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea {...form.register("description")} rows={3} />
            <FieldError />
          </Field>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <Button loading={updateMutation.isPending} type="submit">
            <FloppyDiskIcon />
            Save
          </Button>
          <Button variant="ghost" type="button" onClick={onStopEditing}>
            <XIcon />
            Cancel
          </Button>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide">Required Attributes</h2>
          <Button variant="secondary" size="sm" type="button" onClick={createDialog.openDialog}>
            <PlusIcon />
            Add
          </Button>
        </div>
        {position.attributes.length > 0 ? (
          <dl className="mt-4 space-y-3">
            {position.attributes.map((pa) => (
              <div key={pa.id} className="flex items-center justify-between gap-4">
                <dt className="text-sm text-muted-foreground shrink-0">{pa.attribute.name}</dt>
                <span className="flex-1 border-b border-dotted border-border" />
                <dd className="flex items-center gap-2">
                  <Badge variant="info" className="text-xs">
                    {pa.attribute.type}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => handleDeleteAttribute(pa.attributeId)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <XCircleIcon className="size-4" />
                  </button>
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No attributes assigned to this position.</p>
        )}
      </div>

      <AttributePicker open={createDialog.open} onOpenChange={createDialog.setOpen} onSelect={handleAddAttributes} disabledRows={disabledRows} />
    </Form>
  );
};

const PositionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const user = useAuthStore((store) => store.user);

  const { data: position, isFetching } = useQuery({
    queryKey: ["positions", id],
    queryFn: () => fetchPosition(id!),
    enabled: !!id,
  });

  const { data: resumesData } = useQuery({
    queryKey: ["positions", id, "resumes"],
    queryFn: () => fetchPositionResumes(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePosition(id!),
  });

  const applyMutation = useMutation({
    mutationFn: () => applyToPosition(id!),
  });

  const handleApply = () => {
    applyMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Application sent");
        queryClient.invalidateQueries({ queryKey: ["positions"] });
        queryClient.invalidateQueries({ queryKey: ["positions", id, "resumes"] });
        queryClient.invalidateQueries({ queryKey: ["resumes"] });
      },
      onError: () => {
        toast.error("Application failed");
      },
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this position?")) return;

    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Deleted");
        queryClient.invalidateQueries({ queryKey: ["positions"] });
        navigate("/positions");
      },
      onError: () => {
        toast.error("Delete failed");
      },
    });
  };

  const positionData = position?.data;
  const resumes = resumesData?.data ?? [];

  return (
    <div className="relative min-h-full">
      {isFetching ? (
        <div className="fixed inset-0 bg-black/60 h-full grid place-items-center z-50">
          <Spinner />
        </div>
      ) : null}

      {positionData ? (
        <div className="mx-auto max-w-4xl px-4 py-8">
          <button
            onClick={() => navigate("/positions")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeftIcon className="size-4" />
            Back to positions
          </button>

          <div className="rounded-2xl border bg-card p-8">
            {editing ? (
              <PositionForm
                position={positionData}
                onStopEditing={() => {
                  setEditing(false);
                  queryClient.invalidateQueries({
                    queryKey: ["positions", id],
                  });
                }}
              />
            ) : (
              <PositionView position={positionData} resumes={resumes} onEdit={() => setEditing(true)} onDelete={handleDelete} onApply={handleApply} userRole={user?.role ?? "CANDIDATE"} />
            )}
          </div>
        </div>
      ) : (
        !isFetching && (
          <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="text-center py-20">
              <p className="text-muted-foreground">Position not found.</p>
              <Button variant="ghost" className="mt-4" onClick={() => navigate("/positions")}>
                Back to positions
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PositionPage;
