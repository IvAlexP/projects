import { useSearchParams } from "react-router-dom";
import { Header } from "@/components";
import { ListOfSets, SetOfCards } from "@/features/library/components";

function Library() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSetId = searchParams.get("set");

  return (
    <div>
      <Header />
      <div className="pageContent">
        {!selectedSetId ? (
          <div>
            <h2>Welcome to your library!</h2>
            <ListOfSets onSelect={(id) => setSearchParams({ set: id })} />
          </div>
        ) : (
          <SetOfCards setId={selectedSetId} />
        )}
      </div>
    </div>
  );
}

export default Library;
