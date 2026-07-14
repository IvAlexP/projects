import styles from "./BadgeForm.module.css";
import { Button } from "@/components";
import { type Badge } from "@/types/admin.types";

type BadgeFormData = Omit<Badge, "id" | "createdAt" | "code">;

interface BadgeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: BadgeFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  isEditMode: boolean;
}

export const BadgeForm = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  isEditMode,
}: BadgeFormProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{isEditMode ? "Edit badge" : "Create badge"}</h2>

        <div className={styles.configSection}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="ex: 7-Day Warrior"
          />
        </div>

        <div className={styles.configSection}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Congrats message..."
          />
        </div>

        <div className={styles.row}>
          <div className={styles.configSection}>
            <label>Icon</label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={onChange}
              placeholder="ex: 🥈"
            />
          </div>
          <div className={styles.configSection}>
            <label>Streak</label>
            <input
              type="number"
              name="requiredStreak"
              value={formData.requiredStreak}
              onChange={onChange}
              min={1}
            />
          </div>
          <div className={styles.configSection}>
            <label>Reward</label>
            <input
              type="number"
              name="pointsReward"
              value={formData.pointsReward}
              onChange={onChange}
              min={0}
            />
          </div>
        </div>
        <div className={styles.modalActions}>
          <Button text="Cancel" onClick={onClose} variant="danger" />
          <Button
            text="Save"
            onClick={onSubmit}
            disabled={formData.requiredStreak <= 0 || !formData.name}
          />
        </div>
      </div>
    </div>
  );
};
