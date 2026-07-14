import { useState } from "react";
import type { Card } from "@/types";
import styles from "./cardContent.module.css";
import { CardForm } from "../";
import { Button } from "@/components";

interface Props {
  card: Card;
  onUpdate: (cardId: number, question: string, answer: string) => Promise<void>;
  onDelete: (cardId: number) => Promise<void>;
  onEditToggle: (isEditing: boolean) => void;
  disabled?: boolean;
  seeAnswers?: boolean;
  disableDelete?: boolean;
}

export const CardContent = ({
  card,
  onUpdate,
  onDelete,
  onEditToggle,
  disabled,
  seeAnswers = false,
  disableDelete = false,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = (value: boolean) => {
    setIsEditing(value);
    onEditToggle(value);
  };

  const handleUpdate = async (data: { question: string; answer: string }) => {
    await onUpdate(card.id, data.question, data.answer);
    toggleEdit(false);
  };

  if (isEditing) {
    return (
      <CardForm
        initialValues={{ question: card.question, answer: card.answer }}
        onSave={handleUpdate}
        onCancel={() => toggleEdit(false)}
      />
    );
  }

  return (
    <div className={`formCard ${styles.cardItem}`}>
      <p>
        <b>Q:</b> {card.question}
      </p>
      <p className={styles.answer} data-reveal={seeAnswers}>
        <b>A:</b> {card.answer}
      </p>
      <div className={styles.cardActions}>
        <Button
          text="Edit"
          onClick={() => toggleEdit(true)}
          disabled={disabled}
          variant="light"
        />
        <Button
          text="Delete"
          onClick={() => onDelete(card.id)}
          disabled={disabled || disableDelete}
          variant="lightDanger"
        />
      </div>
    </div>
  );
}
