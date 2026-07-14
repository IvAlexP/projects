import styles from "./setOfCards.module.css";
import { useSetManager } from "../../../hooks";
import { CardForm, CardContent } from "../";
import { SetInfoForm } from "../../";
import { Button } from "@/components";
import { SetForm } from "../../sets";
import { handleDownload } from "../../../utils/downloadSet";
import { ShareSet } from "../ShareSet/ShareSet";

interface Props {
  setId: string;
}

export const SetOfCards = ({ setId }: Props) => {
  const { setData, loading, ui, shareUi, shareState, actions } = useSetManager(setId);

  if (loading) {
    return <div>Loading cards...</div>;
  }

  if (!setData) {
    return <div>Set not found</div>;
  }

  if (ui.isEditingSet) {
    return (
      <div className={styles.detailView}>
        <SetForm
          initialData={setData}
          onSave={actions.handleUpdateSet}
          onCancel={() => ui.setIsEditingSet(false)}
        />
      </div>
    );
  }

  return (
    <div>
      <ShareSet 
        ui={shareUi} 
        state={shareState} 
        actions={actions} 
      />

      <div className={styles.detailView}>
        <Button
          text="← Back"
          className={styles.backButton}
          to="/library"
          variant="light"
        />
        {ui.isEditingInfo ? (
          <SetInfoForm
            initialData={{
              title: setData.title,
              description: setData.description,
            }}
            onSave={async (info) => {
              await actions.handleUpdateSet(info); // send only title and description
              ui.setIsEditingInfo(false);
            }}
            onCancel={() => ui.setIsEditingInfo(false)}
          />
        ) : (
          <div className={styles.setInfo}>
            <h1>{setData.title}</h1>
            <h2>{setData.description}</h2>
            <div className={styles.infoActions}>
              <Button
                text="Edit"
                onClick={() => ui.setIsEditingInfo(true)}
                disabled={ui.isAnyFormOpen}
                variant="light"
              />
            </div>
          </div>
        )}
      </div>

      <div className={styles.infoSection}>
        <p>Number of Cards: {setData.cards.length}</p>
        <p>
          Source Files:{" "}
          <i>
            {setData.sourceFiles.length === 0
              ? "No source files"
              : setData.sourceFiles.join(", ")}
          </i>
        </p>
        <p>
          Created on:{" "}
          {new Date(setData.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className={styles.actions}>
        <Button
          text="Edit Set"
          onClick={() => ui.setIsEditingSet(true)}
          disabled={ui.isAnyFormOpen}
        />
        <Button
          text="+ Card"
          onClick={() => ui.setIsAdding(true)}
          disabled={ui.isAnyFormOpen}
        />
        <Button
          text="Delete Set"
          onClick={() => actions.handleDeleteSet()}
          disabled={ui.isAnyFormOpen}
          variant="danger"
        />
        <Button
          text="CSV"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload(setId, "csv");
          }}
          disabled={ui.isAnyFormOpen}
        />
        <Button
          text="PDF"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload(setId, "pdf");
          }}
          disabled={ui.isAnyFormOpen}
        />
        <Button
          text="➤Share"
          onClick={() => actions.openShareModal()}
          disabled={ui.isAnyFormOpen}
        />
      </div>

      <Button
        className={styles.seeAnswersBtn}
        variant="light"
        text={ui.seeAnswers ? "Hide" : "See"}
        onClick={() => ui.setSeeAnswers(!ui.seeAnswers)}
      />

      <div className={styles.cardsGrid}>
        {ui.isAdding && (
          <CardForm
            onSave={actions.handleCreateCard}
            onCancel={() => ui.setIsAdding(false)}
          />
        )}
        {setData.cards.map((card) => {
          const isThisCardDisabled =
            ui.isAnyFormOpen && ui.editingCardId !== card.id;
          const isOnlyOneCard = setData.cards.length <= 1;

          return (
            <div
              key={card.id}
              className={isThisCardDisabled ? styles.dimmed : ""}
            >
              <CardContent
                card={card}
                onUpdate={actions.handleUpdateCard}
                onDelete={actions.handleDeleteCard}
                onEditToggle={(isEditing) =>
                  ui.setEditingCardId(isEditing ? card.id : null)
                }
                disabled={isThisCardDisabled}
                seeAnswers={ui.seeAnswers}
                disableDelete={isOnlyOneCard}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
