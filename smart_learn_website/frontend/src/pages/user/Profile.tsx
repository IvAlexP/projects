import { Header } from "@/components";
import { useAuth } from "@/context/auth/AuthContext";
import {
  ProfileInfo,
  ProfileBadges,
  PersonalTop,
} from "@/features/profile/components";

function Profile() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <div>
      <Header />
      <div className="pageContent">
        <h2>My Profile</h2>

        <ProfileInfo isAdmin={isAdmin} />

        {!isAdmin && (
          <>
            <PersonalTop />
            <ProfileBadges />
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
