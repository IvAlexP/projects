import styles from "./listOfSets.module.css";
import { Button, CardWrapper } from "@/components";
import { SetForm } from "../";
import { useGenerateSet } from "../../../hooks";
import { GenerateSet } from "../GenerateSet/GenerateSet";

interface Props {
  onSelect: (id: string) => void;
}

export const ListOfSets = ({ onSelect }: Props) => {
  const { sets, loading, ui, config, previewData, fileInputRef, csvInputRef, actions } =
    useGenerateSet();

  if (loading) {
    return (
      <p className={styles.setsContainer}>Loading your awesome cards...</p>
    );
  }

  return (
    <>
      <GenerateSet
        ui={ui}
        config={config}
        actions={actions}
        fileInputRef={fileInputRef}
      />
      <div className={styles.detailView}>
        {!ui.isAdding && (
          <div className={styles.actions}>
            <Button text="+ New Set" onClick={() => ui.setIsAdding(true)} />
            <Button text="Import CSV" onClick={actions.triggerCsvSelect} />
            <Button
              text="✨ Generate with AI"
              onClick={actions.openConfigModal}
            />
            {/* Hidden file input for Ai generation */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={actions.handleFileChange}
              accept=".txt,.md,.pdf"
              multiple
              style={{ display: "none" }}
            />
            {/* Hidden file input for CSV import */}
            <input
            type="file"
            ref={csvInputRef}
            onChange={actions.handleCsvImport}
            accept=".csv"
            style={{ display: "none" }}
          />
          </div>
        )}
        <div className={styles.setsContainer}>
          {ui.isAdding && (
            <SetForm
              initialData={previewData || undefined}
              onSave={actions.handleCreateSet}
              onCancel={() => ui.setIsAdding(false)}
            />
          )}
          {sets.map((set) => (
            <CardWrapper
              key={set.id}
              onClick={() => onSelect(set.id.toString())}
              className={styles.set}
            >
              <h3>{set.title}</h3>
              <p>{set.description}</p>
              <p className={styles.count}>
                {set.cardCount} {set.cardCount === 1 ? "card" : "cards"}
              </p>
              <span className={styles.arrow}>→</span>
            </CardWrapper>
          ))}
        </div>
      </div>
    </>
  );
};
