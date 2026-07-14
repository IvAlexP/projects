import styles from "./ProfileInfo.module.css";
import { Button } from "@/components";
import { ProfileEditForm } from "../DisplayNameForm";
import { PasswordChangeForm } from "../PasswordForm";
import { useProfileInfo } from "../../hooks/useProfileInfo";

interface ProfileInfoProps {
  isAdmin?: boolean;
}

export const ProfileInfo = ({ isAdmin = false }: ProfileInfoProps) => {
  const {
    profile,
    isEditing,
    setIsEditing,
    isChangingPassword,
    setIsChangingPassword,
    handleSaveDisplayName,
    handleUpdatePassword,
    handleDeleteAccount,
    isDeletingAccount,
  } = useProfileInfo();

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className={styles.profileInfo}>
      {isEditing ? (
        <ProfileEditForm
          initialValues={{ displayName: profile.displayName }}
          onCancel={() => setIsEditing(false)}
          onSave={handleSaveDisplayName}
        />
      ) : (
        <div className={styles.infoItem}>
          <b>Display Name:</b> {profile.displayName}
          <div className={styles.infoAction}>
            <Button
              onClick={() => setIsEditing(true)}
              text="Edit"
              variant="light"
              disabled={isChangingPassword}
            />
          </div>
        </div>
      )}

      {!isAdmin && (
        <>
          <div className={styles.infoItem}>
            <b>Points:</b> <span className={styles.points}>{profile.points} XP</span>
          </div>
          <div className={styles.infoItem}>
            <b>Streak:</b> {profile.currentStreak}🔥
          </div>
          <div className={styles.infoItem}>
            <b>Longest Streak:</b> {profile.longestStreak}🔥
          </div>
          <div className={styles.infoItem}>
            <b>Email:</b> {profile.email}
          </div>
        </>
      )}

      {isChangingPassword ? (
        <PasswordChangeForm
          onCancel={() => setIsChangingPassword(false)}
          onSave={handleUpdatePassword}
        />
      ) : (
        <div className={styles.buttonGroup}>
          <Button
            onClick={() => setIsChangingPassword(true)}
            text="Change Password"
            disabled={isEditing}
          />
          
          {!isAdmin && (
            <Button
              variant="danger"
              text="Delete Account"
              disabled={isEditing || isDeletingAccount}
            />
          )}
        </div>
      )}
    </div>
  );
};