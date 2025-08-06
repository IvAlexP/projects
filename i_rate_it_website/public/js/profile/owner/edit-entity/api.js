function updateEntityData(entityId, updateData) {
  const headers = window.JWTManager.getAuthHeaders();
  headers["Content-Type"] = "application/json";

  console.log(
    "Making PUT request with JSON to:",
    `/IRI_LilKartoffel/api/entities/${entityId}`
  );
  console.log("Update data:", updateData);

  return fetch(`/IRI_LilKartoffel/api/entities/${entityId}`, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(updateData),
  })
    .then((res) => {
      return res.text().then((text) => {
        try {
          return JSON.parse(text);
        } catch (e) {
          throw new Error("Invalid JSON response: " + text);
        }
      });
    })
    .then((data) => {
      if (data.success) {
        return data;
      } else {
        throw new Error(data.error || "Failed to update entity");
      }
    });
}

function uploadEntityPicture(entityId, pictureFile) {
  const formData = new FormData();
  formData.append("picture", pictureFile);
  formData.append("folder", "entities"); 
  formData.append("entity_id", entityId); 

  const headers = window.JWTManager.getAuthHeaders();
  delete headers["Content-Type"]; 

  console.log("Uploading picture for entity:", entityId);

  return fetch("/IRI_LilKartoffel/api/upload-picture", {
    method: "POST",
    headers: headers,
    body: formData,
  })
    .then((res) => {
      return res.text().then((text) => {
        try {
          return JSON.parse(text);
        } catch (e) {
          throw new Error("Invalid JSON response from upload: " + text);
        }
      });
    })
    .then((data) => {
      if (data.success) {
        const updateData = { picture: data.file_path };
        const headers = window.JWTManager.getAuthHeaders();
        headers["Content-Type"] = "application/json";

        return fetch(`/IRI_LilKartoffel/api/entities/${entityId}`, {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(updateData),
        })
          .then((res) => res.json())
          .then((updateResult) => {
            if (updateResult.success) {
              return {
                success: true,
                message: "Entity and picture updated successfully!",
              };
            } else {
              throw new Error("Failed to update entity with picture path");
            }
          });
      } else {
        throw new Error(data.error || "Failed to upload picture");
      }
    });
}

function updateEntityWithPicture(entityId, updateData, pictureFile) {
  return updateEntityData(entityId, updateData)
    .then((data) => {
      if (data.success) {
        if (pictureFile) {
          return uploadEntityPicture(entityId, pictureFile);
        } else {
          return { success: true, message: "Entity updated successfully!" };
        }
      } else {
        throw new Error(data.error || "Failed to update entity");
      }
    });
}

window.updateEntityData = updateEntityData;
window.uploadEntityPicture = uploadEntityPicture;
window.updateEntityWithPicture = updateEntityWithPicture;
