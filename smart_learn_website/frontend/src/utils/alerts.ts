import Swal from "sweetalert2";

export const confirmAlert = async (
  title: string = "Are you sure?",
  text: string = "You won't be able to revert this!",
): Promise<boolean> => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    iconColor: "var(--red)",
    showCancelButton: true,
    confirmButtonColor: "var(--red)",
    cancelButtonColor: "var(--secondary-color)",
    confirmButtonText: "Yes, I am sure",
    cancelButtonText: "No, cancel",
  });

  return result.isConfirmed;
};

export const choosePracticeModeAlert = async (): Promise<
  "self" | "auto" | null
> => {
  const result = await Swal.fire({
    title: "Choose Practice Mode",
    text: "How would you like to practice today?",
    icon: "question",
    iconColor: "var(--secondary-color)",
    showCancelButton: true,
    confirmButtonText: "Auto Evaluation",
    confirmButtonColor: "var(--secondary-color)",
    cancelButtonText: "Self Evaluation",

    cancelButtonColor: "var(--primary-color)",
  });

  if (result.isConfirmed) {
    return "auto";
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    return "self";
  }

  return null;
};
