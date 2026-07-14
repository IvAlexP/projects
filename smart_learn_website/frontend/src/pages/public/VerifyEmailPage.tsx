import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthService } from "@/api/auth.service";
import { toast } from "sonner";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");
  let isMounted = true;

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("Invalid verification link.");
        return;
      }
      try {
        const response = await AuthService.verifyEmail(token);
         if (!isMounted) return;
        toast.success(response.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        if (!isMounted) return;
        const apiErrorMessage =
          error.response?.data?.message || "Verification failed.";
        setStatus(apiErrorMessage);
        toast.error(apiErrorMessage);
      }
    };

    verifyToken();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h2>{status}</h2>
    </div>
  );
}

export default VerifyEmailPage;