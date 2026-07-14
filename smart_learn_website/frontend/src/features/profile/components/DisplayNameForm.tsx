import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type DisplayNameForm, displayNameSchema } from "@/validation";
import { Button, FieldWrapper } from "@/components";

interface ProfileEditProps {
  initialValues: DisplayNameForm;
  onSave: (data: DisplayNameForm) => void;
  onCancel: () => void;
}

export const ProfileEditForm = ({
  initialValues,
  onSave,
  onCancel,
}: ProfileEditProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DisplayNameForm>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: initialValues,
  });

  return (
    <div className="formCard">
      <form
        onSubmit={handleSubmit(onSave)}
        className="formLayout"
        noValidate
      >
        <FieldWrapper label="Display Name:" error={errors.displayName?.message}>
          <input
            {...register("displayName")}
            placeholder="Enter your name..."
            className={`input ${errors.displayName ? "inputError" : ""}`}
          />
        </FieldWrapper>

        <div className="formActions">
          <Button
            text={isSubmitting ? "Updating..." : "Save"}
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
    </div>
  );
};
