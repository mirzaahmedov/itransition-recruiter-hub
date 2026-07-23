import { Spinner } from "@/components/ui/spinner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchUser, fetchUserAttributes, fetchUserProjects, fetchUserResumes } from "./api";
import { ProfileAttributes } from "./ProfileAttributes";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileProjects } from "./ProfileProjects";
import { Tabs, TabsList, TabsPanel, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PencilSimpleLineIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { XIcon } from "lucide-react";
import { ProfileResumes } from "./ProfileResumes";

enum TabOption {
  DETAILS = "DETAILS",
  RESUMES = "RESUMES",
}

const UserProfilePage = () => {
  const userId = useParams().id;

  const [tabValue, setTabValue] = useState(TabOption.DETAILS);
  const [editing, setEditing] = useState(false);

  const queryClient = useQueryClient();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
  });
  const { data: userAttributes, isLoading: isLoadingUserAttributes } = useQuery({
    queryKey: ["users", userId, "attributes"],
    queryFn: () => fetchUserAttributes(userId!),
    enabled: !!userId,
  });
  const { data: userProjects, isLoading: isLoadingUserProjects } = useQuery({
    queryKey: ["users", userId, "projects"],
    queryFn: () => fetchUserProjects(userId!),
    enabled: !!userId,
  });

  const { data: userResumes, isLoading: isLoadingUserResumes } = useQuery({
    queryKey: ["resumes", userId],
    queryFn: () => fetchUserResumes(userId!),
    enabled: !!userId,
  });

  const userData = user?.data;
  const userAttributesData = userAttributes?.data;
  const userProjectsData = userProjects?.data ?? [];
  const userResumesData = userResumes?.data ?? [];

  const isLoading = isLoadingUser || isLoadingUserAttributes || isLoadingUserProjects;

  const handleEdit = () => {
    setEditing(true);
  };

  const handleStopEditing = () => {
    setEditing(false);
    queryClient.invalidateQueries({
      queryKey: ["users", userId, "attributes"],
    });
    queryClient.invalidateQueries({
      queryKey: ["users", userId, "projects"],
    });
  };

  return (
    <div className="relative min-h-full">
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : userData && userAttributesData ? (
        <div className="mx-auto max-w-4xl px-4 py-8">
          <ProfileHeader user={userData} />
          <Tabs
            className="mt-8"
            value={tabValue}
            onValueChange={(value) => {
              setEditing(false);
              setTabValue(value);
            }}
          >
            <div className="flex items-center justify-between px-4">
              <TabsList variant="underline">
                <TabsTrigger value={TabOption.DETAILS}>Details</TabsTrigger>
                <TabsTrigger value={TabOption.RESUMES}>
                  Resumes
                  <Badge>{userResumesData.length}</Badge>
                </TabsTrigger>
              </TabsList>
              {editing ? (
                <Button variant="link" onClick={handleStopEditing}>
                  <XIcon />
                  Cancel
                </Button>
              ) : (
                <Button variant="link" onClick={handleEdit}>
                  <PencilSimpleLineIcon />
                  Edit
                </Button>
              )}
            </div>
            <TabsPanel value={TabOption.DETAILS}>
              <ProfileAttributes user={userData} attributes={userAttributesData} editing={editing} />
              <ProfileProjects user={userData} projects={userProjectsData} editing={editing} />
            </TabsPanel>
            <TabsPanel value={TabOption.RESUMES}>
              <ProfileResumes resumes={userResumesData} isLoading={isLoadingUserResumes} />
            </TabsPanel>
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">Nothing to show</div>
      )}
    </div>
  );
};

export default UserProfilePage;
