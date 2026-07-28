import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/use-auth-store";
import { Can } from "@casl/react";
import { ArrowLeftIcon, HeartIcon, TrashIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { ResumeStatus } from "@rh/database/browser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { createResumeLike, deleteResume, deleteResumeLike, fetchResume, publishResume } from "./api";
import { ResumeForm } from "./resume-form";
import { ResumeProjects } from "./resume-projects";
import { ResumeView } from "./resume-view";

const ResumePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((store) => store.user);

  const [editing, setEditing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { data: resume, isLoading } = useQuery({
    queryKey: ["resumes", id],
    queryFn: () => fetchResume(id!),
    enabled: !!id,
  });

  const resumeData = resume?.data;
  const isOwner = user && resumeData && user.id === resumeData.userId;

  const publishMutation = useMutation({
    mutationFn: () => publishResume(resumeData!.positionId, id!),
    onSuccess: () => {
      toast.success("Resume published");
      queryClient.invalidateQueries({ queryKey: ["resumes", id] });
    },
    onError: (err: { response?: { data?: { data?: string } } }) => {
      const msg = err.response?.data?.data ?? "Failed to publish resume";
      toast.error(msg);
    },
  });

  const deleteResumeMutation = useMutation({
    mutationFn: () => deleteResume(resume?.data?.positionId!, resume?.data?.id!),
    onSuccess: () => {
      navigate("/resumes");
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });

  const createResumeLikeMutation = useMutation({
    mutationFn: () => createResumeLike(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", id] });
      queryClient.invalidateQueries({ queryKey: ["resumeLikes"] });
      setIsLiked(true);
    },
  });
  const deleteResumeLikeMutation = useMutation({
    mutationFn: () => deleteResumeLike(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", id] });
      queryClient.invalidateQueries({ queryKey: ["resumeLikes"] });
      setIsLiked(false);
    },
  });

  const handleLike = () => {
    if (isLiked) {
      deleteResumeLikeMutation.mutate();
    } else {
      createResumeLikeMutation.mutate();
    }
  };

  useEffect(() => {
    if (resumeData?.likes?.length) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [resumeData?.likes?.length]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="text-center py-20">
          <p className="text-muted-foreground">Resume not found.</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate("/resumes")}>
            Back to resumes
          </Button>
        </div>
      </div>
    );
  }

  const filledCount = resumeData.attributes.filter(
    (ra) =>
      ra.userAttribute.textValue ||
      ra.userAttribute.numberValue != null ||
      ra.userAttribute.booleanValue != null ||
      ra.userAttribute.dateValue ||
      (ra.userAttribute.startDateValue && ra.userAttribute.endDateValue) ||
      ra.userAttribute.choice,
  ).length;

  const isFilledProperly = filledCount === resumeData.attributes.length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="no-print flex flex-wrap items-center mb-6 gap-y-5">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate("/resumes")}>
            <ArrowLeftIcon className="size-4" />
            Back to resumes
          </Button>

          <Badge variant={filledCount === resumeData.attributes.length ? "info" : "destructive"}>
            {filledCount}/{resumeData.attributes.length} fields filled
          </Badge>
        </div>

        <div className="flex items-center flex-wrap gap-2 ml-auto">
          {isOwner && resumeData.status === ResumeStatus.DRAFT && (
            <>
              <Button disabled={!isFilledProperly} onClick={() => publishMutation.mutate()} loading={publishMutation.isPending}>
                <UploadSimpleIcon />
                Publish
              </Button>
              <DeleteConfirmationDialog
                render={
                  <Button
                    loading={deleteResumeMutation.isPending}
                    variant="destructive-outline"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <TrashIcon /> Delete
                  </Button>
                }
                onConfirm={deleteResumeMutation.mutate}
              />
            </>
          )}
          <Can I="manage" a="Like">
            <Button variant="outline" onClick={handleLike} loading={createResumeLikeMutation.isPending || deleteResumeLikeMutation.isPending}>
              {isLiked ? (
                <>
                  <HeartIcon weight="fill" /> Liked
                </>
              ) : (
                <>
                  <HeartIcon /> Like
                </>
              )}
            </Button>
          </Can>
        </div>
      </div>
      {editing ? (
        <div className="rounded-2xl border bg-card shadow-sm">
          <ResumeForm
            resume={resumeData}
            onDoneEditing={() => {
              setEditing(false);
              queryClient.invalidateQueries({
                queryKey: ["resumes", id],
              });
              queryClient.invalidateQueries({
                queryKey: ["users", resumeData.userId, "attributes"],
              });
            }}
          />
          <ResumeProjects projects={resumeData.projects} />
        </div>
      ) : (
        <div className="resume-container rounded-2xl border bg-card shadow-sm">
          <ResumeView resume={resumeData} onEdit={() => setEditing(true)} />
          <ResumeProjects projects={resumeData.projects} />
        </div>
      )}
    </div>
  );
};

export default ResumePage;
