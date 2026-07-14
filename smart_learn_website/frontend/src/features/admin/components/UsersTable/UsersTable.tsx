import { useAdminUsers } from "../../hooks/useAdminUsers";
import styles from "./UsersTable.module.css";
import { Button } from "@/components";

export const UsersTable = () => {
  const { users, isLoading, handleDeleteUser } = useAdminUsers();

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Registration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td data-label="ID">{user.id}</td>
              <td data-label="Email">
                <span className={styles.email}>{user.email}</span>
              </td>
              <td data-label="Role">
                <span
                  className={
                    user.role === "ADMIN" ? styles.badgeAdmin : styles.badgeUser
                  }
                >
                  {user.role}
                </span>
              </td>
              <td data-label="Last Activity">
                {new Date(user.lastActivityAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </td>
              <td data-label="Registered">
                 {new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </td>
              <td data-label="Actions">
                {user.role !== "ADMIN" && (
                  <Button
                    text="Delete"
                    variant="danger"
                    onClick={() => handleDeleteUser(user.id, user.email)}
                  />
                )}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={7} className={styles.emptyRow}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};