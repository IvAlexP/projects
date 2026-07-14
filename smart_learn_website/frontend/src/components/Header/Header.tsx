import { Button } from "../Button/Button";
import { DropdownMenu, DropdownItem } from "../Dropdown";
import { useAuth } from "../../context/auth/AuthContext";
import styles from "./Header.module.css";
import { Logo, Navbar } from "@/components";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await logout();
      const apiMessage = result.message || "Logged out!";
      toast.success(apiMessage);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header>
      <div className={styles.headerContainer}>
        <Logo />

        {user ? (
          <div className={styles.userInfo}>
            {user.role !== "ADMIN" ? (
              <>
                <div>
                  <span className={styles.points}>{user.points} XP</span> 
                </div>
                {user.currentStreak > 0 && (
                  <div>
                    <b>{user.currentStreak}</b>🔥
                  </div>
                )}
              </>
            ) : (
              <div>
                <span className={styles.admin}>ADMIN</span>
              </div>
            )}
            
            <DropdownMenu
              trigger={
                <Button variant="light" text={`${user?.displayName} ▼`} />
              }
            >
              <DropdownItem to="/profile">Profile</DropdownItem>
              <DropdownItem onClick={handleLogout}>Log out</DropdownItem>
            </DropdownMenu>
          </div>
        ) : (
          <Button text="Log in" to="/login" />
        )}
      </div>

      {user && <Navbar />}
    </header>
  );
};