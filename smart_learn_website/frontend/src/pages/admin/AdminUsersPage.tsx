import { Header } from "@/components";
import { UsersTable } from "@/features/admin/components/UsersTable/UsersTable";

function AdminUsersPage() {
  return (
    <div>
      <Header />
      <div className="pageContent">
        <h2>Welcome to admin panel for Users!</h2>
        <UsersTable />
      </div>
    </div>
  );
}

export default AdminUsersPage;
