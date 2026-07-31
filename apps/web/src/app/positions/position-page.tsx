import { fetchPositionResumes } from "@/app/resumes/api";
import { createSupportTicket } from "@/app/support-ticket/api";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { SupportTicketDialog } from "@/components/support-ticket-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDialogState } from "@/hooks/use-dialog-state";
import { parseApiErrorMessage } from "@/lib/api/error";
import { useAuthStore } from "@/store/use-auth-store";
import { Can } from "@casl/react";
import { ArchiveIcon, ArrowLeftIcon, ArrowRightIcon, KeyIcon, QuestionIcon, ReadCvLogoIcon, TrashIcon } from "@phosphor-icons/react";
import { PositionStatus, UserRole } from "@rh/database/browser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createApiKey, createPositionResume, deletePosition, fetchPosition, updatePositionStatus } from "./api";
import { PositionApiKeyDialog } from "./position-api-key-dialog";
import { PositionAttributes } from "./position-attributes";
import { PositionHeader } from "./position-header";

const PositionPage = () => {
  const { id } = useParams();

  const currentUser = useAuthStore((store) => store.user);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const supportDialog = useDialogState();

  const [apiKey, setApiKey] = useState<string>();

  const supportMutation = useMutation({
    mutationFn: createSupportTicket,
  });

  const handleSupportSubmit = (values: { title: string; link: string; priority: string }) => {
    supportMutation.mutate(
      { ...values, positionId: id, priority: values.priority as "HIGH" | "AVERAGE" | "LOW" },
      {
        onSuccess: () => {
          toast.success("Support ticket created");
          supportDialog.closeDialog();
        },
        onError: (res) => {
          const message = parseApiErrorMessage(res);
          toast.error(message ?? "Failed to create support ticket");
        },
      },
    );
  };

  const { data: position, isFetching } = useQuery({
    queryKey: ["positions", id],
    queryFn: () => fetchPosition(id!),
    enabled: !!id,
  });

  const { data: resumesData, isLoading: isLoadingResumes } = useQuery({
    queryKey: ["positions", id, "resumes"],
    queryFn: () => fetchPositionResumes(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePosition(id!),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: PositionStatus) => updatePositionStatus(id!, status),
  });

  const createPositionResumeMutation = useMutation({
    mutationFn: () => createPositionResume(id!),
  });

  const createApiKeyMutation = useMutation({
    mutationFn: () => createApiKey(id!),
  });

  const handleCreateResume = () => {
    createPositionResumeMutation.mutate(undefined, {
      onSuccess: (res) => {
        toast.success("Resume generated");
        queryClient.invalidateQueries({ queryKey: ["positions"] });
        queryClient.invalidateQueries({ queryKey: ["positions", id, "resumes"] });
        queryClient.invalidateQueries({ queryKey: ["resumes"] });

        navigate(`/resumes/${res?.data?.id}`);
      },
      onError: (res) => {
        const message = parseApiErrorMessage(res);
        toast.error(message ?? "Application failed");
      },
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Deleted");
        queryClient.invalidateQueries({ queryKey: ["positions"] });
        navigate("/positions");
      },
      onError: (res) => {
        const message = parseApiErrorMessage(res);
        toast.error(message ?? "Delete failed");
      },
    });
  };

  const handleArchive = () => {
    updateStatusMutation.mutate(PositionStatus.ARCHIVED, {
      onSuccess: () => {
        toast.success("Position archived");
        queryClient.invalidateQueries({ queryKey: ["positions"] });
        queryClient.invalidateQueries({ queryKey: ["positions", id, "resumes"] });
        queryClient.invalidateQueries({ queryKey: ["resumes"] });
      },
      onError: (res) => {
        const message = parseApiErrorMessage(res);
        toast.error(message ?? "Could not archive position");
      },
    });
  };
  const handleUnarchive = () => {
    updateStatusMutation.mutate(PositionStatus.ACTIVE, {
      onSuccess: () => {
        toast.success("Position unarchived");
        queryClient.invalidateQueries({ queryKey: ["positions"] });
        queryClient.invalidateQueries({ queryKey: ["positions", id, "resumes"] });
        queryClient.invalidateQueries({ queryKey: ["resumes"] });
      },
      onError: (res) => {
        const message = parseApiErrorMessage(res);
        toast.error(message ?? "Could not unarchive position");
      },
    });
  };

  const handleCreateApiKey = async () => {
    createApiKeyMutation.mutateAsync().then((res) => setApiKey(res.data.rawToken ?? ""));
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
          <div className="flex items-center flex-wrap gap-5 justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate("/positions")}>
              <ArrowLeftIcon className="size-4" />
              Back to positions
            </Button>
            <div className="flex items-center gap-2">
              <Can I="update" a="Position">
                {positionData.status === PositionStatus.ACTIVE ? (
                  <Button variant="outline" onClick={handleArchive} loading={updateStatusMutation.isPending}>
                    <ArchiveIcon /> Archive
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleUnarchive} loading={updateStatusMutation.isPending}>
                    <ArchiveIcon /> Unarchive
                  </Button>
                )}
              </Can>
              <Can I="delete" a="Position">
                <DeleteConfirmationDialog
                  onConfirm={handleDelete}
                  render={
                    <Button variant="destructive-outline" loading={deleteMutation.isPending}>
                      <TrashIcon /> Delete
                    </Button>
                  }
                />
              </Can>
              <Can I="apply" a="Position">
                {positionData.resumes?.length === 0 ? (
                  <Button onClick={handleCreateResume} loading={createPositionResumeMutation.isPending}>
                    <ReadCvLogoIcon />
                    Generate Resume
                  </Button>
                ) : null}
              </Can>

              <Button loading={createApiKeyMutation.isPending} onClick={handleCreateApiKey}>
                <KeyIcon className="icon" />
                Get API Key
              </Button>
              <Button variant="ghost" onClick={() => supportDialog.openDialog()}>
                <QuestionIcon />
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-4 md:p-8">
            <PositionHeader position={positionData} />
            <PositionAttributes position={positionData} />

            {isLoadingResumes ? (
              <div className="flex items-center justify-center py-5">
                <Spinner />
              </div>
            ) : (
              resumes.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <h2 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide">Applications ({resumes.length})</h2>
                  <div className="mt-4 space-y-2">
                    {resumes.map((resume) => (
                      <Link
                        key={resume.id}
                        to={`/resumes/${resume.id}`}
                        className="flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-accent/50"
                      >
                        <div className="flex items-center gap-3">
                          {currentUser?.role !== UserRole.CANDIDATE && (
                            <Avatar className="size-10">
                              <AvatarImage src={resume.user.avatar ?? undefined} alt={resume.user.name ?? "Avatar"} />
                              <AvatarFallback>{(resume.user.name ?? "U").charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          )}
                          <span className="text-sm font-medium">{resume.user?.name ?? "Unnamed"}</span>
                          {currentUser?.role === UserRole.CANDIDATE ? (
                            <Badge variant={resume.status === "PUBLISHED" ? "success" : "warning"} size="sm">
                              {resume.status}
                            </Badge>
                          ) : null}
                        </div>
                        <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              )
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

      <SupportTicketDialog
        open={supportDialog.open}
        onOpenChange={supportDialog.setOpen}
        onSubmit={handleSupportSubmit}
        isSubmitting={supportMutation.isPending}
        positionTitle={positionData?.title}
      />

      <PositionApiKeyDialog
        open={!!apiKey}
        onOpenChange={(open) => {
          if (!open) {
            setApiKey(undefined);
          }
        }}
        apiKey={apiKey}
      />
    </div>
  );
};

export default PositionPage;
