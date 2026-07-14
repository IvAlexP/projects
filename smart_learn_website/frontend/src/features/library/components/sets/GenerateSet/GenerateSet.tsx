import styles from "./GenerateSet.module.css";
import { useGenerateSet } from "../../../hooks";
import { Button } from "@/components";

type GenerateSetProps = Pick<
  ReturnType<typeof useGenerateSet>,
  "ui" | "config" | "actions" | "fileInputRef"
>;

export const GenerateSet = ({
  ui,
  config,
  actions,
  fileInputRef,
}: GenerateSetProps) => {
  const difficultyOptions = ["Easy", "Medium", "Hard"];

  return (
    <>
      {ui.isGenerating && (
        <div className={styles.blockingOverlay}>
          <div className={styles.spinner}>
            ✨ Gemini is generating your cards... Please wait.
          </div>
        </div>
      )}

      {config.showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Configure AI Generation</h2>

            <div className={styles.configSection}>
              <h3>Difficulty:</h3>
              <p>Choose at least one</p>
              <div className={styles.checkboxGroup}>
                {difficultyOptions.map((level) => (
                  <label key={level}>
                    <input
                      type="checkbox"
                      checked={config.difficulty.includes(level)}
                      onChange={() => actions.toggleDifficulty(level)}
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.configSection}>
              <h3>Number of Cards:</h3>
              <p>Enter a positive number</p>
              <input
                type="number"
                min={1}
                max={50}
                value={config.questionCount}
                onChange={(e) =>
                  actions.setQuestionCount(Number(e.target.value))
                }
              />
            </div>

            <div className={styles.configSection}>
              <h3>Upload Files</h3>
              <p>Upload at least one file (maximum 50MB)</p>
              <Button text="+ Add Files" onClick={actions.triggerFileSelect} />
              <input
                type="file"
                ref={fileInputRef}
                onChange={actions.handleFileChange}
                accept=".txt,.md,.pdf"
                multiple
                style={{ display: "none" }}
              />

              {config.selectedFiles.length == 0 ? (
                <div>No files selected.</div>
              ) : (
                <div className={styles.fileList}>
                  {config.selectedFiles.map((file) => (
                    <div key={file.name}>
                      {file.name}
                      <button
                        className={styles.removeFile}
                        onClick={() => actions.removeSelectedFile(file.name)}
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              <Button
                text="Cancel"
                onClick={actions.closeConfigModal}
                variant="danger"
              />
              <Button
                text="Generate"
                onClick={actions.submitAiGeneration}
                disabled={
                  config.selectedFiles.length === 0 ||
                  config.difficulty.length === 0 ||
                  config.questionCount <= 0
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
