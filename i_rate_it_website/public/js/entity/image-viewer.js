class ImageViewer {
  constructor() {
    this.currentImageIndex = 1;
    this.currentReviewImages = [];
    this.modal = null;
    this.init();
  }

  init() {
    this.createModal();
    this.bindEvents();
  }
  createModal() {
    this.modal = document.createElement("div");
    this.modal.id = "image-modal";
    this.modal.className = "modal";
    this.modal.innerHTML = `
      <button class="close-modal" aria-label="Close">&times;</button>
      <button class="modal-prev modal-nav" aria-label="Previous image" style="display: none;"><</button>
      <button class="modal-next modal-nav" aria-label="Next image" style="display: none;">></button>
      <div class="modal-content">
        <div class="modal-loading">Loading...</div>
        <img id="modal-image" src="" alt="Review image" style="display: none;">
        <div class="modal-counter" style="display: none;">
          <span id="modal-current">1</span> / <span id="modal-total">1</span>
        </div>
      </div>
    `;
    document.body.appendChild(this.modal);
  }

  bindEvents() {
    const closeBtn = this.modal.querySelector(".close-modal");
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.close();
    });

    const prevBtn = this.modal.querySelector(".modal-prev");
    const nextBtn = this.modal.querySelector(".modal-next");

    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.navigate(-1);
    });

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.navigate(1);
    });

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (this.modal.classList.contains("show")) {
        switch (e.key) {
          case "Escape":
            this.close();
            break;
          case "ArrowLeft":
            this.navigate(-1);
            break;
          case "ArrowRight":
            this.navigate(1);
            break;
        }
      }
    });
  }
  open(imageSrc, allImages = []) {
    this.currentReviewImages = allImages.length > 0 ? allImages : [imageSrc];
    this.currentImageIndex = this.currentReviewImages.indexOf(imageSrc);

    if (this.currentImageIndex === -1) {
      this.currentImageIndex = 0;
    }

    this.modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    this.loadImage(imageSrc);
    this.updateCounter();

    setTimeout(() => {
      this.modal.classList.add("show");
    }, 10);
  }
  close() {
    this.modal.classList.remove("show");
    this.modal.style.display = "none";
    document.body.style.overflow = "";
  }

  navigate(direction) {
    if (this.currentReviewImages.length <= 1) return;

    this.currentImageIndex += direction;
    if (this.currentImageIndex < 0)
      this.currentImageIndex = this.currentReviewImages.length - 1;
    if (this.currentImageIndex >= this.currentReviewImages.length)
      this.currentImageIndex = 0;

    this.loadImage(this.currentReviewImages[this.currentImageIndex]);
    this.updateCounter();
  }

  loadImage(src) {
    const modalImage = this.modal.querySelector("#modal-image");
    const loadingDiv = this.modal.querySelector(".modal-loading");

    if (modalImage && loadingDiv) {
      loadingDiv.style.display = "block";
      modalImage.style.display = "none";

      const img = new Image();
      img.onload = () => {
        modalImage.src = src;
        loadingDiv.style.display = "none";
        modalImage.style.display = "block";
        this.updateCounter();
      };
      img.src = src;
    }
  }

  updateCounter() {
    const currentSpan = this.modal.querySelector("#modal-current");
    const totalSpan = this.modal.querySelector("#modal-total");
    const counter = this.modal.querySelector(".modal-counter");
    const prevBtn = this.modal.querySelector(".modal-prev");
    const nextBtn = this.modal.querySelector(".modal-next");

    if (currentSpan && totalSpan && counter && prevBtn && nextBtn) {
      if (this.currentReviewImages.length > 1) {
        currentSpan.textContent = this.currentImageIndex + 1;
        totalSpan.textContent = this.currentReviewImages.length;
        counter.style.display = "block";
        prevBtn.style.display = "block";
        nextBtn.style.display = "block";
      } else {
        counter.style.display = "none";
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
      }
    }
  }
}

window.ImageViewer = ImageViewer;
