import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchUser, fetchUserAttributes, fetchUserProjects } from "./api";
import { ProfileAttributes } from "./ProfileAttributes";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileProjects } from "./ProfileProjects";

const UserProfilePage = () => {
  const userId = useParams().id;

  const { data: user, isFetching: isFetchingUser } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
  });
  const { data: userAttributes, isFetching: isFetchingUserAttributes } = useQuery({
    queryKey: ["users", userId, "attributes"],
    queryFn: () => fetchUserAttributes(userId!),
    enabled: !!userId,
  });
  const { data: userProjects, isFetching: isFetchingUserProjects } = useQuery({
    queryKey: ["users", userId, "projects"],
    queryFn: () => fetchUserProjects(userId!),
    enabled: !!userId,
  });

  const userData = user?.data;
  const userAttributesData = userAttributes?.data;
  const userProjectsData = userProjects?.data ?? [];

  const isLoading = isFetchingUser || isFetchingUserAttributes || isFetchingUserProjects;

  return (
    <div className="relative min-h-full">
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : userData && userAttributesData ? (
        <div className="mx-auto max-w-4xl px-4 py-8">
          <ProfileHeader user={userData} />
          <ProfileAttributes user={userData} attributes={userAttributesData} />
          <ProfileProjects user={userData} projects={userProjectsData} />
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">Nothing to show</div>
      )}
    </div>
  );
};

export default UserProfilePage;
