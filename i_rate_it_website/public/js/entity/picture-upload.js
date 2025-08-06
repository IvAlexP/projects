class PictureUpload {
  constructor() {
    this.uploadedPictures = [];
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const uploadBtn = document.getElementById("upload-btn");
    const fileInput = document.getElementById("picture-upload");

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener("click", () => {
        fileInput.click();
      });

      fileInput.addEventListener("change", (e) => {
        const files = Array.from(e.target.files);
        files.forEach((file) => {
          if (file.type.startsWith("image/")) {
            this.uploadPicture(file);
          }
        });
        fileInput.value = "";
      });
    }
  }
  uploadPicture(file) {
    const formData = new FormData();
    formData.append("picture", file);
    formData.append("folder", "reviews"); // Specify reviews folder for review pictures

    JWTManager.authenticatedFetch("/IRI_LilKartoffel/api/upload-picture", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())      .then((data) => {
        console.log("Upload response:", data);
        if (data.status >= 200 && data.status < 300 && data.file_path) {
          console.log("Adding preview for:", data.file_path);
          this.addPicturePreview(data.file_path, file.name);
          this.uploadedPictures.push(data.file_path);
        } else {
          alert("Error uploading picture: " + data.error);
        }
      })
      .catch((error) => {
        console.error("Error uploading picture:", error);
        alert("Failed to upload picture. Please try again.");
      });
  }
  addPicturePreview(path, filename) {
    console.log("Adding picture preview:", path, filename);
    const previewContainer = document.getElementById("preview-container");
    if (!previewContainer) {
      console.error("Preview container not found!");
      return;
    }

    const previewItem = document.createElement("div");
    previewItem.className = "preview-item";
    previewItem.dataset.path = path;    const img = document.createElement("img");
    img.src = "/IRI_LilKartoffel/public/" + path;
    img.alt = filename;
    img.className = "preview-image";
    console.log("Image src set to:", img.src);
    
    img.addEventListener("click", () => {
      if (window.imageViewer) {
        window.imageViewer.open(img.src);
      }
    });
    
    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "x";
    removeBtn.className = "delete-image-btn";
    removeBtn.addEventListener("click", () => {
      this.removePicturePreview(previewItem, path);
    });

    previewItem.appendChild(img);
    previewItem.appendChild(removeBtn);
    previewContainer.appendChild(previewItem);
  }
  removePicturePreview(previewItem, path) {
    // Delete the file from server
    // this.deletePictureFromServer(path);
    
    // const index = this.uploadedPictures.indexOf(path);
    // if (index > -1) {
    //   this.uploadedPictures.splice(index, 1);
    // }
    // previewItem.remove();
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

  getUploadedPictures() {
    return this.uploadedPictures;
  }
}

window.PictureUpload = PictureUpload;
