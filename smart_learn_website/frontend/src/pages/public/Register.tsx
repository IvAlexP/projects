import RegisterForm from "@/features/auth/components/RegisterForm";
import backgStyles from "@/features/auth/styles/bckgForm.module.css";

function Register() {
  return (
    <div className={backgStyles.formBckgContainer}>
      <div className={backgStyles.formBckg} />
      <div className={backgStyles.formWrapper}>
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;