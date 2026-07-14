import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { AdminService } from "@/api";
import { type Badge } from "@/types";
import { confirmAlert } from "@/utils/alerts";

type BadgeFormData = Omit<Badge, "id" | "createdAt" | "code">;

const initialFormData: BadgeFormData = {
  name: "",
  description: "",
  icon: "",
  requiredStreak: 0,
  pointsReward: 0,
};

export const useAdminBadges = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);  
  const [formData, setFormData] = useState<BadgeFormData>(initialFormData);

  const fetchBadges = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await AdminService.getBadges();
      setBadges(response.data);
    } catch (error: any) {
      const apiErrorMessage = error.response?.data?.message || "Failed to share set.";
      toast.error(apiErrorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteBadge = async (id: number, name: string) => {
    const confirm = await confirmAlert(`Are you sure you want to delete the badge "${name}"?`);
    if (!confirm) return;

    try {
      const response = await AdminService.deleteBadge(id);
      setBadges((prev) => prev.filter((b) => b.id !== id));
      toast.success(response.message);
    } catch (error: any) {
      const apiErrorMessage = error.response?.data?.message || "Failed to delete badge.";
      toast.error(apiErrorMessage);
    }
  };

  const openCreateModal = () => {
    setEditingBadge(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (badge: Badge) => {
    setEditingBadge(badge);
    setFormData({
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      requiredStreak: badge.requiredStreak,
      pointsReward: badge.pointsReward,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBadge(null);
    setFormData(initialFormData);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "requiredStreak" || name === "pointsReward" ? Number(value) : value,
    }));
  };

  const handleFormSubmit = async () => {
    try {
      if (editingBadge) {
        const response = await AdminService.updateBadge(editingBadge.id, formData);
        toast.success(response.message);
      } else {
        const response = await AdminService.createBadge(formData);
        toast.success(response.message);
      }
      
      closeModal();
      await fetchBadges(); 
    } catch (error: any) {
      console.error(error);
      const apiErrorMessage = error.response?.data?.message || "Error saving badge.";
      toast.error(apiErrorMessage);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);

  return {
    badges,
    isLoading,
    handleDeleteBadge,
    isModalOpen,
    editingBadge,
    formData,
    handleFormChange,
    openCreateModal,
    openEditModal,
    closeModal,
    handleFormSubmit,
  };
};