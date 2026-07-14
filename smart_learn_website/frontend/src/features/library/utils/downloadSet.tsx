import { SetsService } from "@/api";
import { toast } from "sonner";

export const handleDownload = async (setId: string, format: "csv" | "pdf") => {
  try {
    const response = await SetsService.downloadSet(setId, format);
    const url = window.URL.createObjectURL(response);
    const link = document.createElement("a");

    link.href = url;
    link.download = `set-${setId}.${format}`;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed", error);
    toast.error("Failed to download the set.");
  }
};
