import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updatePasswordSchema,
  rules,
  type UpdatePasswordForm,
} from "@/validation";
import { Button, FieldWrapper } from "@/components";

interface PasswordChangeFormProps {
  onCancel: () => void;
  onSave: (data: UpdatePasswordForm) => Promise<void>;
}

export const PasswordChangeForm = ({
  onCancel,
  onSave,
}: PasswordChangeFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<UpdatePasswordForm>({
    resolver: zodResolver(updatePasswordSchema),
    mode: "onChange",
  });

  const watchedNewPassword = useWatch({
    control,
    name: "newPassword",
    defaultValue: "",
  });

  const onSubmit = async (data: UpdatePasswordForm) => {
    setIsLoading(true);
    try {
      await onSave(data);
    } catch (error: any) {
      const apiErrorMessage =
        error.response?.data?.message || "An error occurred.";
      setError("currentPassword", { type: "manual", message: apiErrorMessage });
      setValue("newPassword", "");
      setValue("confirmNewPassword", "");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)} className="formCard" noValidate>
        <FieldWrapper
          label="Current Password:"
          error={errors.currentPassword?.message}
        >
          <input
            type="password"
            {...register("currentPassword")}
            className={`input ${errors.currentPassword ? "inputError" : ""}`}
          />
        </FieldWrapper>

        <FieldWrapper label="New Password:" error={errors.newPassword?.message}>
          <input
            type="password"
            {...register("newPassword")}
            className={`input ${errors.newPassword ? "inputError" : ""}`}
          />
        </FieldWrapper>

        <FieldWrapper
          label="Confirm New Password:"
          error={errors.confirmNewPassword?.message}
        >
          <input
            type="password"
            {...register("confirmNewPassword")}
            className={`input ${errors.confirmNewPassword ? "inputError" : ""}`}
          />
        </FieldWrapper>

        {watchedNewPassword.length > 0 && (
          <ul className="passwordStrength">
            {rules.map((rule, index) => (
              <li
                key={index}
                className={`strengthItem ${
                  rule.regex.test(watchedNewPassword) ? "valid" : "invalid"
                }`}
              >
                {rule.label}
              </li>
            ))}
          </ul>
        )}

        <div className="formActions">
          <Button
            text={isLoading ? "Saving..." : "Save"}
            type="submit"
            disabled={isLoading}
          />
          <Button
            text="Cancel"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            variant="danger"
          />
        </div>
      </form>
  );
};
