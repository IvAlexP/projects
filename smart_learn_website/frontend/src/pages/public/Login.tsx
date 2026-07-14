import LoginForm from "@/features/auth/components/LoginForm";
import backgStyles from "@/features/auth/styles/bckgForm.module.css";

function LogInPage() {
  return (
    <div className={backgStyles.formBckgContainer}>
      <div className={backgStyles.formBckg} />
      <div className={backgStyles.formWrapper}>
        <LoginForm />
      </div>
    </div>
  );
}

export default LogInPage;