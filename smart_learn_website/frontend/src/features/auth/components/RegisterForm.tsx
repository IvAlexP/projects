import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  rules,
  type RegisterForm as RegisterFormValues,
} from "@/validation";
import { AuthService } from "@/api";
import baseStyles from "../styles/baseForm.module.css";
import { Button, Logo, FieldWrapper } from "@/components";
import { toast } from 'sonner';

function RegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  // real time changes on rules list
  const watchedPassword = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await AuthService.register({
        email: data.email,
        password: data.password,
      });
      const apiMessage = response.message || "Account created! Please check your email to verify your account.";
      toast.success(apiMessage);
      navigate("/login");
    } catch (error: any) {
      const apiErrorMessage =
        error.response?.data?.message ||
        "An error occurred during registration.";
      setError("email", {
        type: "manual",
        message: apiErrorMessage,
      });
      setValue("password", "");
      setValue("confirmPassword", "");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={baseStyles.form}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <h1 className={baseStyles.formTitle}>
        Sign Up on <Logo />
      </h1>

      <FieldWrapper label="Email" error={errors.email?.message}>
        <input
          type="email"
          {...register("email")}
          className={`input ${errors.email ? "inputError" : ""}`}
        />
      </FieldWrapper>

      <FieldWrapper label="Password" error={errors.password?.message}>
        <input
          type="password"
          {...register("password")}
          className={`input ${errors.password ? "inputError" : ""}`}
        />
      </FieldWrapper>

      <FieldWrapper
        label="Confirm Password"
        error={errors.confirmPassword?.message}
      >
        <input
          type="password"
          {...register("confirmPassword")}
          className={`input ${errors.confirmPassword ? "inputError" : ""}`}
        />
      </FieldWrapper>

      {watchedPassword.length > 0 && (
        <ul className="passwordStrength">
          {rules.map((rule, index) => (
            <li
              key={index}
              className={`strengthItem ${
                rule.regex.test(watchedPassword) ? "valid" : "invalid"
              }`}
            >
              {rule.label}
            </li>
          ))}
        </ul>
      )}

      <Button
        text={isLoading ? "Loading..." : "Sign Up"}
        type="submit"
        disabled={isLoading}
        className={baseStyles.formButton}
      />

      <div>
        Already have an account? Sign in{" "}
        <Link to="/login" className={baseStyles.link}>
          here
        </Link>
        .
      </div>
    </form>
  );
}

export default RegisterForm;
