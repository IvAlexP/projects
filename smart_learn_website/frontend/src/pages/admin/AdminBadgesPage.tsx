import { Header } from "@/components";
import { BadgesTable } from "@/features/admin/components/BadgesTable/BadgesTable";

function AdminBadgesPage() {
  return (
    <div>
      <Header />
      <div className="pageContent">
        <h2>Welcome to admin panel for Badges!</h2>
        <BadgesTable />
      </div>
    </div>
  );
}

export default AdminBadgesPage;
