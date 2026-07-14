import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldWrapper, Button } from "@/components";
import { infoSchema, type InfoValues } from "@/validation";

interface Props {
  initialData: { title: string; description?: string };
  onSave: (data: InfoValues) => Promise<void>;
  onCancel: () => void;
}

export const SetInfoForm = ({ initialData, onSave, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InfoValues>({
    resolver: zodResolver(infoSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="formCard">
      <FieldWrapper label="Title:" error={errors.title?.message}>
        <input {...register("title")} className={`input ${errors.title ? "inputError" : ""}`} />
      </FieldWrapper>

      <FieldWrapper label="Description:" error={errors.description?.message}>
        <textarea {...register("description")} className={`input ${errors.description ? "inputError" : ""}`} />
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
