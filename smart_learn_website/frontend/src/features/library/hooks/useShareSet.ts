import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UserService, SetsService } from "@/api";

export const useShareSet = (setId: number | undefined) => {
  const [searchResults, setSearchResults] = useState<
    { id: number; displayName: string }[]
  >([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await UserService.searchUsers(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const actions = {
    openShareModal: () => setIsShareModalOpen(true),
    closeShareModal: () => {
      setIsShareModalOpen(false);
      setSearchQuery("");
      setSearchResults([]);
      setSelectedUserId(null);
    },
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setSelectedUserId(null);
    },
    selectUser: (userId: number) => setSelectedUserId(userId),

    submitShareSet: async () => {
      if (!setId || !selectedUserId) return;

      try {
        await SetsService.shareSet(setId, selectedUserId);
        toast.success("Set shared successfully.");
        actions.closeShareModal();
      } catch (error: any) {
        const apiErrorMessage =
          error.response?.data?.message || "Failed to share set.";
        toast.error(apiErrorMessage);
      }
    },
  };

  return {
    ui: {
      isShareModalOpen,
      isSearching,
    },
    state: { searchQuery, searchResults, selectedUserId },
    actions,
  };
};
