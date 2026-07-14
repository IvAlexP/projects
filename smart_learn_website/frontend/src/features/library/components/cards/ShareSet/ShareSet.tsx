import styles from "./ShareSet.module.css";
import { Button } from "@/components";
import { useShareSet } from "../../../hooks";

type ShareSetProps = Pick<
  ReturnType<typeof useShareSet>,
  "ui" | "state" | "actions"
>;

export const ShareSet = ({ ui, state, actions }: ShareSetProps) => {
  if (!ui.isShareModalOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Share Set</h2>

        <div className={styles.configSection}>
          <p>Find user by their display name</p>
          <input
            type="text"
            placeholder="Search..."
            value={state.searchQuery}
            onChange={actions.handleSearchChange}
          />

          {ui.isSearching && <p>Searching...</p>}

          {!ui.isSearching && state.searchResults.length > 0 && (
            <div className={styles.scrollableList}>
              {state.searchResults.map((user) => (
                <label key={user.id}>
                  <input
                    type="radio"
                    name="selectedUser"
                    checked={state.selectedUserId === user.id}
                    onChange={() => actions.selectUser(user.id)}
                  />
                  {user.displayName}
                </label>
              ))}
            </div>
          )}

          {!ui.isSearching &&
            state.searchQuery &&
            state.searchResults.length === 0 && <p>No users found.</p>}
        </div>

        <div className={styles.modalActions}>
          <Button
            text="Cancel"
            onClick={actions.closeShareModal}
            variant="danger"
          />
          <Button
            text="Share"
            onClick={actions.submitShareSet}
            disabled={state.selectedUserId === null}
          />
        </div>
      </div>
    </div>
  );
};
