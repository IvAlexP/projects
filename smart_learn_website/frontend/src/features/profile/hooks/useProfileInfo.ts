import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserService, GamificationService, AuthService } from "@/api";
import { useAuth } from "@/context/auth/AuthContext";
import { type User, type Badge } from "@/types";
import { toast } from "sonner";
import { confirmAlert } from "@/utils/alerts";

export const useProfileInfo = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { updateUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await UserService.getProfile();
        setProfile(data);
      } catch (err: any) {
        console.error(err.response?.data?.message || "Failed to load profile info.");
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    GamificationService.getUserBadges()
      .then(setBadges)
      .catch((err) => console.error("Failed to load badges", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSaveDisplayName = async (data: { displayName: string }) => {
    try {
      const response = await UserService.updateDisplayName(data.displayName);
      updateUser(response.user);
      setProfile(response.user);
      setIsEditing(false);
      toast.success(response.message || "Display name updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update display name.");
    }
  };

  const handleUpdatePassword = async (data: any) => {
    try {
      const response = await UserService.updatePassword(data.currentPassword, data.newPassword);
      setIsChangingPassword(false);
      toast.success(response.message || "Password updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password.");
      throw error;
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirmAlert(
      "Delete Account",
      "Are you sure you want to delete your account?"
    );

    if (!confirmed) return;

    setIsDeletingAccount(true);
    try {
      const response = await AuthService.deleteAccount();
      toast.success(response.message);
      await logout();
      navigate("/", { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete account");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return {
    profile,
    isEditing,
    setIsEditing,
    isChangingPassword,
    setIsChangingPassword,
    isDeletingAccount,
    badges,
    isLoading,
    handleSaveDisplayName,
    handleUpdatePassword,
    handleDeleteAccount,
  };
};