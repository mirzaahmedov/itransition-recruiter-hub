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

  return (
    <div className="relative h-full px-5">
      {isFetchingUser || isFetchingUserAttributes ? (
        <div className="fixed inset-0 bg-black/60 h-full grid place-items-center">
          <Spinner />
        </div>
      ) : null}

      {userData && userAttributesData ? (
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
        <div>Nothing to show</div>
      )}
    </div>
  );
};

export default UserProfilePage;
