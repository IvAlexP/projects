import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginForm as LoginFormValues,
} from "@/validation";
import baseStyles from "../styles/baseForm.module.css";
import { Button, Logo, FieldWrapper } from "@/components";
import { useAuth } from "@/context/auth/AuthContext";
import { toast } from 'sonner';

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await login(data);
      const apiMessage = result.message || "User logged in successfully!";
      toast.success(apiMessage);

      const from = location.state?.from?.pathname || "/dashboard";
      const search = location.state?.from?.search || "";
      // navigate to the full path including query params (like /dashboard?tab=reports)
      navigate(from + search, { replace: true });
    } catch (error: any) {
      const apiErrorMessage =
        error.response?.data?.message || "An error occurred during login.";
      setError("email", {
        type: "manual",
        message: apiErrorMessage,
      });
      setValue("password", "");
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
        Sign In to <Logo />
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

      <Button
        text={isLoading ? "Loading..." : "Sign In"}
        type="submit"
        disabled={isLoading}
        className={baseStyles.formButton}
      />

      <div>
        Don't have an account? Sign up{" "}
        <Link to="/register" className={baseStyles.link}>
          here
        </Link>
        .
      </div>
    </form>
  );
}

export default LoginForm;
