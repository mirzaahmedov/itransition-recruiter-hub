import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPosition } from "./api";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, FloppyDiskIcon } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePositionSchema, type CreatePositionPayload } from "@rh/shared";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const PositionCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<CreatePositionPayload>({
    resolver: zodResolver(CreatePositionSchema),
    defaultValues: {
      title: "",
      description: "",
      attributes: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: createPosition,
    onSuccess: (data) => {
      toast.success("Position created");
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      navigate(`/positions/${data.data.id}`);
    },
    onError: () => {
      toast.error("Failed to create position");
    },
  });

  const handleSave = form.handleSubmit(async (values) => {
    await createMutation.mutateAsync(values);
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <button
        onClick={() => navigate("/positions")}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeftIcon className="size-4" />
        Back to positions
      </button>

      <div className="rounded-2xl border bg-card p-8">
        <Form className="contents" onSubmit={handleSave}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Create new position</h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button loading={createMutation.isPending} type="submit">
                <FloppyDiskIcon />
                Save
              </Button>
            </div>
          </div>

          <div className="mt-8 space-y-4">
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

          <div className="mt-8 border-t pt-6">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide">
              Required Attributes
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Save the position first, then add attributes from the position
              page.
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PositionCreatePage;
