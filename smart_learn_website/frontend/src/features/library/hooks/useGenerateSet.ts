import { useState, useEffect, useRef } from "react";
import { SetsService } from "@/api/sets.service";
import { useSetActions } from "./useSetActions";
import { toast } from "sonner";
import type { Set } from "@/types";
import type { SetFormValues } from "@/validation";
import Papa from "papaparse";

export const useGenerateSet = () => {
  const [sets, setSets] = useState<Set[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState<SetFormValues | null>(
    null,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [difficulty, setDifficulty] = useState<string[]>(["medium"]);
  const [questionCount, setQuestionCount] = useState<number>(10);

  const handleCloseForm = () => {
    setIsAdding(false);
    setPreviewData(null);
  };

  const { handleCreateSet } = useSetActions(setSets, handleCloseForm);

  useEffect(() => {
    SetsService.fetchAllSets().then((res) => {
      setSets(res);
      setLoading(false);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    if (newFiles.length === 0) return;

    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    const currentSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);
    const newSize = newFiles.reduce((sum, f) => sum + f.size, 0);

    if (currentSize + newSize > MAX_SIZE) {
      toast.error(
        `Cannot add files. The total size would exceed the 50MB limit.`,
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFiles((prev) => {
      const filteredNew = newFiles.filter(
        (nf) => !prev.some((pf) => pf.name === nf.name),
      );
      return [...prev, ...filteredNew];
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeSelectedFile = (fileName: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  const toggleDifficulty = (level: string) => {
    setDifficulty((prev) =>
      prev.includes(level) ? prev.filter((d) => d !== level) : [...prev, level],
    );
  };

  const openConfigModal = () => setShowConfigModal(true);

  const closeConfigModal = () => {
    setShowConfigModal(false);
    setSelectedFiles([]);
    setDifficulty(["medium"]);
    setQuestionCount(10);
  };

  const submitAiGeneration = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }
    if (difficulty.length === 0) {
      toast.error("Please select at least one difficulty level.");
      return;
    }
    if (questionCount <= 0) {
      toast.error("Please enter a valid number of cards to generate.");
      return;
    }

    setIsGenerating(true);

    try {
      const generatedData = await SetsService.generateSetFromFile(
        selectedFiles,
        difficulty,
        questionCount,
      );

      if (generatedData) {
        setPreviewData(generatedData);
        setIsAdding(true);
      }
    } catch (err) {
      toast.error("Failed to generate flashcards with AI.");
    } finally {
      closeConfigModal();
      setIsGenerating(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const triggerCsvSelect = () => {
    csvInputRef.current?.click();
  };

 const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        
        const cards = results.data.map((row: any) => {
          const question = row.Question || row.question || "";
          const answer = row.Answer || row.answer || "";
          
          return { question: question.trim(), answer: answer.trim() };
        }).filter(card => card.question || card.answer);

        if (cards.length === 0) {
          toast.error("No valid cards found in the CSV file.");
          return;
        }

        setPreviewData({
          title: file.name.substring(0, file.name.lastIndexOf('.')),
          description: "Imported from CSV file",
          cards: cards as any,
        });
        setIsAdding(true);
        toast.success(`Loaded set with ${cards.length} cards from CSV!`);
      },
      error: () => {
        toast.error("Failed to parse the CSV file.");
      }
    });

    if (csvInputRef.current) csvInputRef.current.value = ""; 
  };

  return {
    sets,
    loading,
    ui: {
      isAdding,
      setIsAdding,
      isGenerating,
      setIsGenerating,
    },
    previewData: previewData,
    fileInputRef,
    csvInputRef,
    config: {
      showModal: showConfigModal,
      selectedFiles,
      difficulty,
      questionCount,
    },
    actions: {
      handleCreateSet,
      handleFileChange,
      triggerFileSelect,
      triggerCsvSelect,
      handleCsvImport,
      removeSelectedFile,
      toggleDifficulty,
      setQuestionCount,
      openConfigModal,
      closeConfigModal,
      submitAiGeneration,
      closeForm: handleCloseForm,
    },
  };
};
