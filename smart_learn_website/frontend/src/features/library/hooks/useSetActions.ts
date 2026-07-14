import { SetsService } from "@/api/sets.service";
import { useNavigate } from "react-router-dom";
import type { SetFormValues } from "@/validation/set.schema";
import { toast } from "sonner";
import { confirmAlert } from "@/utils/alerts";

export const useSetActions = (
  setSetData: React.Dispatch<React.SetStateAction<any>>,
  closeModals: () => void,
  setId?: number,
) => {
  const navigate = useNavigate();

  const handleCreateSet = async (set: SetFormValues): Promise<void> => {
    try {
      const response = await SetsService.createSet(set);
      setSetData((prev: any[]) => [...prev, response.data]);
      closeModals();
      const apiMessage = response.message || "Set created successfully.";
      toast.success(apiMessage);
    } catch (error: any) {
      const apiErrorMessage =
        error.response?.data?.message || "Failed to create set.";
      toast.error(apiErrorMessage);
    }
  };

  const handleUpdateSet = async (set: Partial<SetFormValues>) => {
    if (setId === undefined) {
      console.error("Update failed: No setId provided");
      return;
    }

    try {
      const response = await SetsService.updateSet(setId, set);
      setSetData((prev: any) => (prev ? { ...prev, ...response.data } : prev));
      closeModals();
      const apiMessage = response.message || "Set updated successfully.";
      toast.success(apiMessage);
    } catch (error: any) {
      const apiErrorMessage =
        error.response?.data?.message || "Error saving set.";
      toast.error(apiErrorMessage);
    }
  };

  const handleDeleteSet = async () => {
    if (setId === undefined) {
      console.error("Delete failed: No setId provided");
      return;
    }

    const isConfirmed = await confirmAlert(
      "Are you sure you want to delete this set?",
      "You won't be able to revert this!"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await SetsService.deleteSet(setId);
      const apiMessage = "Set deleted successfully.";
      toast.success(apiMessage);
      navigate("/library");
    } catch (error: any) {
      const apiErrorMessage =
        error.response?.data?.message || "Failed to delete set.";
      toast.error(apiErrorMessage);
    }
  };

  return {
    handleCreateSet,
    handleUpdateSet,
    handleDeleteSet,
  };
};
