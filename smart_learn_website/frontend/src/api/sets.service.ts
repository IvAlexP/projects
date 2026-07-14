import { api } from "./axios.ts";
import type { Set, SetDetail, PracticeSet } from "@/types";
import type { SetFormValues } from "@/validation";

export const SetsService = {
  fetchAllSets: async (): Promise<Set[]> => {
    const { data } = await api.get("/sets");
    return data;
  },

  fetchSetById: async (setId: string): Promise<SetDetail> => {
    const { data } = await api.get(`/sets/${setId}`);
    return data;
  },

  fetchPracticeSetById: async (setId: string): Promise<PracticeSet> => {
    const { data } = await api.get(`/sets/${setId}/practice`);
    return data;
  },

  fetchDueSets: async (): Promise<Set[]> => {
    const { data } = await api.get("/sets/due");
    return data;
  },

  generateSetFromFile: async (
    files: File[],
    difficulty: string[],
    count: number,
  ): Promise<SetFormValues> => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("count", count.toString());
    difficulty.forEach((level) => formData.append("difficulty[]", level));

    const { data } = await api.post("/sets/generate", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  createSet: async (
    set: SetFormValues,
  ): Promise<{ data: SetDetail; message: string }> => {
    const { data } = await api.post("/sets", set);
    return data;
  },

  updateSet: async (
    setId: number,
    set: Partial<SetFormValues>,
  ): Promise<{ data: SetDetail; message: string }> => {
    const { data } = await api.patch(`/sets/${setId}`, set);
    return data;
  },

  deleteSet: async (setId: number): Promise<{ message: string }> => {
    const { data } = await api.delete(`/sets/${setId}`);
    return data;
  },

  downloadSet: async (setId: string, format: "csv" | "pdf"): Promise<Blob> => {
    const { data } = await api.get(`/sets/${setId}/export/${format}`, {
      responseType: "blob",
    });
    return data;
  },

  shareSet: async (setId: number, userId: number): Promise<{ message: string }> => {
    const { data } = await api.post(`/sets/${setId}/share/${userId}`);
    return data;
  }
};
