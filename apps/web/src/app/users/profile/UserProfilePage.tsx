import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchUser, fetchUserProfile } from "./api";
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
  const { data: userProfile, isFetching: isFetchingUserProfile } = useQuery({
    queryKey: ["users", userId, "profile"],
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
  });

  const userData = user?.data;
  const userProfileData = userProfile?.data;

  return (
    <div className="h-full">
      {isFetchingUser || isFetchingUserProfile ? (
        <div className="h-full grid place-items-center">
          <Spinner />
        </div>
      ) : userData && userProfileData ? (
        editing ? (
          <ProfileForm user={userData} userProfile={userProfileData} onStop={() => setEditing(false)} />
        ) : (
          <ProfileView user={userData} userProfile={userProfileData} onEdit={() => setEditing(true)} />
        )
      ) : (
        <div>Nothing to show</div>
      )}
    </div>
  );
};

export default UserProfilePage;
