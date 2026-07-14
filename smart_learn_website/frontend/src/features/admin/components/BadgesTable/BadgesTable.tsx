import { useAdminBadges } from "../../hooks/useAdminBadges";
import styles from "./BadgesTable.module.css";
import { Button } from "@/components";
import { BadgeForm } from "../BadgeForm/BadgeForm";

export const BadgesTable = () => {
  const {
    badges,
    isLoading,
    handleDeleteBadge,
    isModalOpen,
    editingBadge,
    openCreateModal,
    openEditModal,
    closeModal,
    handleFormSubmit,
    formData,
    handleFormChange,
  } = useAdminBadges();

  if (isLoading) {
    return <div>Loading badges...</div>;
  }

  return (
    <>
      <div className={styles.addBadge}>
        <Button text="+ Add Badge" onClick={openCreateModal} />
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Icon</th>
              <th>Name</th>
              <th>Description</th>
              <th>Streak</th>
              <th>Bonus</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {badges.map((badge) => (
              <tr key={badge.id}>
                <td data-label="Code">{badge.code}</td>
                <td data-label="Icon">{badge.icon}</td>
                <td data-label="Name">{badge.name}</td>
                <td data-label="Description">{badge.description}</td>
                <td data-label="Streak">
                  {" "}
                  {badge.requiredStreak} day
                  {badge.requiredStreak != 1 ? `s` : ``}
                </td>
                <td data-label="Points XP">+{badge.pointsReward} XP</td>
                <td data-label="Actions" className={styles.actions}>
                  <Button
                    text="Edit"
                    variant="primary"
                    onClick={() => openEditModal(badge)}
                  />
                  <Button
                    text="Delete"
                    variant="danger"
                    onClick={() => handleDeleteBadge(badge.id, badge.name)}
                  />
                </td>
              </tr>
            ))}
            {badges.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.emptyRow}>
                  No badges yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <BadgeForm
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleFormSubmit}
          formData={formData}
          onChange={handleFormChange}
          isEditMode={!!editingBadge}
        />
      </div>
    </>
  );
};
