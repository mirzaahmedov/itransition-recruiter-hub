import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchUser, fetchUserAttributes } from "./api";
import { Spinner } from "@/components/ui/spinner";
import { ProfileView } from "./ProfileView";
import { useState } from "react";
import ProfileForm from "./ProfileForm";

const UserProfilePage = () => {
  const userId = useParams().id;

  const [editing, setEditing] = useState(false);

  const { data: user, isFetching: isFetchingUser } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
  });
  const {
    data: userAttributes,
    isFetching: isFetchingUserAttributes,
    refetch: refetchAttributes,
  } = useQuery({
    queryKey: ["users", userId, "attributes"],
    queryFn: () => fetchUserAttributes(userId!),
    enabled: !!userId,
  });

  const userData = user?.data;
  const userAttributesData = userAttributes?.data;

  const isLoading = isFetchingUser || isFetchingUserAttributes;

  return (
    <div className="relative min-h-full">
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : userData && userAttributesData ? (
        editing ? (
          <ProfileForm
            user={userData}
            userAttributes={userAttributesData}
            onStopEditing={() => {
              setEditing(false);
              refetchAttributes();
            }}
          />
        ) : (
          <ProfileView user={userData} userAttributes={userAttributesData} onEdit={() => setEditing(true)} />
        )
      ) : (
        <div className="text-center py-20 text-muted-foreground">Nothing to show</div>
      )}
    </div>
  );
};

export default UserProfilePage;
