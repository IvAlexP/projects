import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setSchema, type SetFormValues } from "@/validation/set.schema.ts";
import { FieldWrapper, Button } from "@/components";
import setStyles from "./setForm.module.css";

interface AddSetFormProps {
  initialData?: SetFormValues; // Optional prop for editing existing sets
  onSave: (data: SetFormValues) => Promise<void>;
  onCancel: () => void;
}

export const SetForm = ({ initialData, onSave, onCancel }: AddSetFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetFormValues>({
    resolver: zodResolver(setSchema),
    defaultValues: initialData ?? {
      title: "",
      description: "",
      cards: [{ question: "", answer: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cards",
  });

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="formCard"
      noValidate
    >
      <h3>{initialData ? "Edit " : "New "} Set</h3>

      <div className={setStyles.details}>
        <FieldWrapper label="Set Title:" error={errors.title?.message}>
          <input
            {...register("title")}
            placeholder="e.g., Biology Basics"
            className={`input ${errors.title ? "inputError" : ""}`}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Description (Optional):"
          error={errors.description?.message}
        >
          <textarea
            {...register("description")}
            placeholder="What is this set about?"
            className={`input ${errors.description ? "inputError" : ""}`}
          />
        </FieldWrapper>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className={`formCard ${setStyles.cardItem}`}>
          <div className={setStyles.cardHeader}>
            <div>
              <b>Card #{index + 1}</b>
            </div>
            {fields.length > 1 && (
              <Button
              text = "Remove Card"
                type="button"
                onClick={() => remove(index)}
                variant="lightDanger"
              />
               
            )}
          </div>

          <div className={setStyles.details}>
            <FieldWrapper
              label="Question:"
              error={errors.cards?.[index]?.question?.message}
            >
              <textarea
                {...register(`cards.${index}.question`)}
                placeholder="Type the question..."
                className={`input ${errors.cards?.[index]?.question ? "inputError" : ""}`}
              />
            </FieldWrapper>

            <FieldWrapper
              label="Answer:"
              error={errors.cards?.[index]?.answer?.message}
            >
              <textarea
                {...register(`cards.${index}.answer`)}
                placeholder="Type the answer..."
                className={`input ${errors.cards?.[index]?.answer ? "inputError" : ""}`}
              />
            </FieldWrapper>
          </div>
        </div>
      ))}

      <Button
        type="button"
        text="+ Add Card"
        onClick={() => append({ question: "", answer: "" })}
        className={setStyles.addCardBtn}
      />

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
