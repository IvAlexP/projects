class ReplyManager {
  constructor(entityId) {
    this.entityId = entityId;
  }

  toggleReplyForm(reviewId, reviewDiv) {
    let existingForm = reviewDiv.querySelector(".reply-form");
    if (existingForm) {
      existingForm.remove();
      return;
    }
    if (!JWTManager.isAuthenticated() || JWTManager.isTokenExpired()) {
      alert("You must be logged in to reply to a review.");
      window.location.href = "/IRI_LilKartoffel/login";
      return;
    }
    const replyForm = document.createElement("div");
    replyForm.className = "reply-form";

    const formContainer = document.createElement("div");
    formContainer.className = "reply-form-container";

    const title = document.createElement("h4");
    title.textContent = "Reply to this review:";

    const textarea = document.createElement("textarea");
    textarea.className = "reply-textarea";
    textarea.placeholder = "Write your reply...";
    textarea.maxLength = 500;
    textarea.rows = 3;

    const pictureUploadDiv = document.createElement("div");
    pictureUploadDiv.className = "reply-picture-upload";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.className = "reply-file-input";
    fileInput.accept = "image/*";
    fileInput.multiple = true;
    fileInput.style.display = "none";    const uploadBtn = document.createElement("button");
    uploadBtn.type = "button";
    uploadBtn.id = "reply-upload-btn";
    uploadBtn.className = "action-btn-base action-btn-secondary";
    uploadBtn.textContent = "Add Pictures";

    const previewContainer = document.createElement("div");
    previewContainer.className = "reply-preview-container";

    pictureUploadDiv.appendChild(fileInput);
    pictureUploadDiv.appendChild(uploadBtn);
    pictureUploadDiv.appendChild(previewContainer);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "reply-form-actions";    const submitBtn = document.createElement("button");
    submitBtn.id = "submit-reply-btn";
    submitBtn.className = "action-btn-base action-btn";
    submitBtn.dataset.reviewId = reviewId;
    submitBtn.textContent = "Submit";
    
    const cancelBtn = document.createElement("button");
    cancelBtn.id = "cancel-reply-btn";
    cancelBtn.className = "action-btn-base action-btn-secondary";
    cancelBtn.textContent = "Cancel";

    actionsDiv.appendChild(submitBtn);
    actionsDiv.appendChild(cancelBtn);

    formContainer.appendChild(title);
    formContainer.appendChild(textarea);
    formContainer.appendChild(pictureUploadDiv);
    formContainer.appendChild(actionsDiv);

    replyForm.appendChild(formContainer);

    reviewDiv.appendChild(replyForm);

    this.initializeReplyForm(replyForm, reviewId);
  }

  initializeReplyForm(replyForm, reviewId) {
    const textarea = replyForm.querySelector(".reply-textarea");
    const uploadBtn = replyForm.querySelector("#reply-upload-btn");
    const fileInput = replyForm.querySelector(".reply-file-input");
    const previewContainer = replyForm.querySelector(
      ".reply-preview-container"
    );    const submitBtn = replyForm.querySelector("#submit-reply-btn");
    const cancelBtn = replyForm.querySelector("#cancel-reply-btn");

    let replyUploadedPictures = [];

    uploadBtn.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          this.uploadReplyPicture(
            file,
            previewContainer,
            replyUploadedPictures
          );
        }
      });
      fileInput.value = "";
    });

    submitBtn.addEventListener("click", () => {
      this.submitReply(
        reviewId,
        textarea.value.trim(),
        replyUploadedPictures,
        replyForm
      );
    });    cancelBtn.addEventListener("click", () => {
      // Delete all uploaded pictures from server before removing form
      replyUploadedPictures.forEach(path => {
        this.deletePictureFromServer(path);
      });
      replyForm.remove();
    });

    textarea.focus();
  }
  uploadReplyPicture(file, previewContainer, uploadedPictures) {
    const formData = new FormData();
    formData.append("picture", file);
    formData.append("folder", "reviews"); // Use reviews folder for reply pictures too

    JWTManager.authenticatedFetch("/IRI_LilKartoffel/api/upload-picture", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200 && data.file_path) {
          this.addReplyPicturePreview(
            data.file_path,
            file.name,
            previewContainer,
            uploadedPictures
          );
          uploadedPictures.push(data.file_path);
        } else {
          alert("Error uploading picture: " + data.error);
        }
      })
      .catch((error) => {
        console.error("Error uploading picture:", error);
        alert("Failed to upload picture. Please try again.");
      });
  }

  addReplyPicturePreview(path, fileName, container, uploadedPictures) {
    const previewDiv = document.createElement("div");
    previewDiv.className = "reply-preview-item";

    const img = document.createElement("img");
    img.src = "/IRI_LilKartoffel/public/" + path;
    img.alt = fileName;
    img.className = "reply-preview-image";    const removeBtn = document.createElement("button");
    removeBtn.textContent = "x";
    removeBtn.className = "delete-image-btn";
    removeBtn.addEventListener("click", () => {
      this.removeReplyPicturePreview(path, previewDiv, uploadedPictures);
    });

    previewDiv.appendChild(img);
    previewDiv.appendChild(removeBtn);
    container.appendChild(previewDiv);
  }
  removeReplyPicturePreview(path, previewDiv, uploadedPictures) {
    // Delete the file from server
    this.deletePictureFromServer(path);
    
    const index = uploadedPictures.indexOf(path);
    if (index > -1) {
      uploadedPictures.splice(index, 1);
    }
    previewDiv.remove();
  }

  deletePictureFromServer(path) {
    JWTManager.authenticatedFetch("/IRI_LilKartoffel/api/delete-picture", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file_path: path
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status < 200 || data.status >= 300) {
        console.error("Error deleting picture:", data.error);
      }
    })
    .catch((error) => {
      console.error("Error deleting picture:", error);
    });
  }

  submitReply(parentId, description, pictures, formElement) {
    if (!description) {
      alert("Please write a reply.");
      return;
    }

    if (description.length > 500) {
      alert("Reply is too long. Maximum 500 characters allowed.");
      return;
    }

    const submitBtn = formElement.querySelector("#submit-reply-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    const replyData = {
      entity_id: this.entityId,
      parent_id: parentId,
      description: description,
      pictures: pictures,
    };

    JWTManager.authenticatedFetch("/IRI_LilKartoffel/api/reviews", {
      method: "POST",
      body: JSON.stringify(replyData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          formElement.remove();

          document.dispatchEvent(
            new CustomEvent("replySubmitted", {
              detail: { parentReviewId: parentId },
            })
          );
        } else {
          alert("Error: " + (data.error || "Failed to submit reply"));
        }
      })
      .catch((error) => {
        console.error("Error submitting reply:", error);
        alert("Failed to submit reply. Please try again.");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
      });
  }
}

window.ReplyManager = ReplyManager;
