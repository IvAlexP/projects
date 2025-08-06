class EntityController {
  constructor() {
    this.allReviews = [];
    this.currentEntityId = null;
    this.uploadedPictures = [];
    
    this.entityManager = null;
    this.reviewManager = null;
    this.imageViewer = null;
    this.pictureUpload = null;
    this.traitRating = null;
    this.replyManager = null;
    
    this.init();
  }
  init() {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");

    if (!id) {
      const urlParts = window.location.pathname.split("/");
      id = urlParts[urlParts.length - 1];
    }

    if (!id || id === "entity.html" || isNaN(id)) {
      console.error("Invalid or missing entity ID in URL");
      this.displayError(
        "Invalid entity ID. Please navigate to this page from the entities list or add ?id=1 to the URL."
      );
      return;
    }

    this.currentEntityId = parseInt(id);
    
    this.initializeModules();
    this.bindEvents();
    this.loadEntity(this.currentEntityId);
  }

  initializeModules() {
    try {
      this.entityManager = new EntityManager();
      this.reviewManager = new ReviewManager(this.entityManager);
      this.imageViewer = new ImageViewer();
      this.pictureUpload = new PictureUpload();
      this.traitRating = new TraitRating();
      this.replyManager = new ReplyManager(this.currentEntityId);      // Expose to global scope for other modules
      window.entityManager = this.entityManager;
      window.reviewManager = this.reviewManager;
      window.imageViewer = this.imageViewer;
      window.pictureUpload = this.pictureUpload;
      window.traitRating = this.traitRating;
      window.replyManager = this.replyManager;

    } catch (error) {
      console.error("Error initializing modules:", error);
    }
  }  async loadEntity(entityId) {
    try {
      const entity = await this.entityManager.loadEntity(entityId);
      await this.reviewManager.loadReviews(entity.id);
      const traitsLoaded = await this.traitRating.loadCategoryTraits(entity.category_id);
      
      if (traitsLoaded) {
        this.initializeReviewForm();
      } else {
        console.warn("Traits failed to load, review form will use fallback validation");
        this.initializeReviewForm();
      }
    } catch (error) {
      console.error("Error loading entity:", error);
      this.displayError("Failed to load entity. Please try again later.");
    }
  }

  displayError(message) {
    const entityContainer = document.querySelector(".entity");
    if (entityContainer) {
      entityContainer.textContent = '';
      const errorP = document.createElement('p');
      errorP.className = 'error';
      errorP.textContent = message;
      entityContainer.appendChild(errorP);
    }
  }  initializeReviewForm() {
    if (window.ReviewForm && this.pictureUpload && this.traitRating && this.currentEntityId) {
      const reviewForm = new ReviewForm(
        this.currentEntityId,
        this.pictureUpload,
        this.traitRating
      );
    } else {
      console.error("Failed to initialize ReviewForm - missing dependencies:", {
        ReviewForm: !!window.ReviewForm,
        pictureUpload: !!this.pictureUpload,
        traitRating: !!this.traitRating,
        currentEntityId: !!this.currentEntityId
      });
    }
  }
  bindEvents() {
    document.addEventListener("reviewSubmitted", () => {
      this.reviewManager.loadReviews(this.currentEntityId);
    });

    document.addEventListener("replySubmitted", (event) => {
      const openReplies = [];
      const openNestedReplies = [];
      
      document.querySelectorAll('.review-item[data-replies-visible="true"]').forEach(reviewDiv => {
        const reviewId = reviewDiv.dataset.reviewId;
        if (reviewId) {
          openReplies.push(reviewId);
        }
      });
      
      document.querySelectorAll('.reply-item[data-nested-replies-visible="true"]').forEach(replyDiv => {
        const replyId = replyDiv.dataset.reviewId; 
        if (replyId) {
          openNestedReplies.push(replyId);
        }
      });
      
      if (event.detail && event.detail.parentReviewId) {
        if (!openReplies.includes(event.detail.parentReviewId.toString())) {
          openReplies.push(event.detail.parentReviewId.toString());
        }
      }
      
      this.reviewManager.loadReviews(this.currentEntityId).then(() => {
        setTimeout(() => {
          openReplies.forEach(reviewId => {
            const reviewDiv = document.querySelector(`[data-review-id="${reviewId}"]`);
            if (reviewDiv) {
              const showRepliesBtn = reviewDiv.querySelector('.action-btn-secondary');
              if (showRepliesBtn && reviewDiv.dataset.repliesVisible !== "true") {
                showRepliesBtn.click();
              }
            }
          });
          
          openNestedReplies.forEach(replyId => {
            const replyDiv = document.querySelector(`[data-review-id="${replyId}"].reply-item`);
            if (replyDiv) {
              const showNestedRepliesBtn = replyDiv.querySelector('.action-btn-secondary');
              if (showNestedRepliesBtn && replyDiv.dataset.nestedRepliesVisible !== "true") {
                showNestedRepliesBtn.click();
              }
            }
          });
        }, 150); 
      }).catch(error => {
        console.error('Error reloading reviews:', error);
      });
    });
  }

  getCurrentEntityId() {
    return this.currentEntityId;
  }
}

// Expose to global scope
window.EntityController = EntityController;
