import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldWrapper } from "@/components";
import style from "./cardForm.module.css";
import { cardSchema, type CardFormValues } from "@/validation";

interface CardFormProps {
  initialValues?: CardFormValues; // if not provided, it's "Add Mode"
  onSave: (data: CardFormValues) => Promise<void>;
  onCancel: () => void;
  title?: string;
}

export const CardForm = ({
  initialValues,
  onSave,
  onCancel,
}: CardFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: initialValues || { question: "", answer: "" },
  });

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className={`formCard ${style.cardItem}`}
      noValidate
    >
      <h3>{initialValues ? "Edit Card" : "Add Card"}</h3>
      <FieldWrapper label="Question:" error={errors.question?.message}>
        <textarea
          {...register("question")}
          placeholder="Type the question..."
          className={`input ${errors.question ? "inputError" : ""}`}
        />
      </FieldWrapper>

      <FieldWrapper label="Answer:" error={errors.answer?.message}>
        <textarea
          {...register("answer")}
          placeholder="Type the answer..."
          className={`input ${errors.answer ? "inputError" : ""}`}
        />
      </FieldWrapper>

      <div className="formActions">
        <Button
          text={isSubmitting ? "Saving..." : "Save"}
          type="submit"
          disabled={isSubmitting}
        />
        <Button
          text="Cancel"
          onClick={onCancel}
          type="button"
          variant="danger"
        />
      </div>
    </form>
  );
};
