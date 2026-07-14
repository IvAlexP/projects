import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { AdminService } from "@/api";
import { type AdminUser } from "@/types/admin.types";
import { confirmAlert } from "@/utils/alerts";

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await AdminService.getUsers();
      setUsers(response.data); 
    } catch (error) {
      console.error(error);
      toast.error("Error fetching users.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteUser = async (id: number, email: string) => {
    const confirm = await confirmAlert(`Are you sure you want to delete the account ${email}?`);
    
    if (!confirm) { 
      return;
    }

    try {
      const response = await AdminService.deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
      toast.success(response.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    handleDeleteUser,
  };
};