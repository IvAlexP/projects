import { Header } from "@/components";
import { ListOfDueSets } from "@/features/dashboard/components";
import { useGamification } from "@/features/dashboard/hooks/useGamification";

function Dashboard() {
  useGamification();

  return (
    <div>
      <Header />
      <div className="pageContent">
        <h2>Welcome to dashboard!</h2>
        <ListOfDueSets />
      </div>
    </div>
  );
}

export default Dashboard;
