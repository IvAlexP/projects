class ReviewForm {
  constructor(entityId, pictureUpload, traitRating) {
    this.entityId = entityId;
    this.pictureUpload = pictureUpload;
    this.traitRating = traitRating;
    this.init();
  }

  init() {
    this.bindEvents();
  }
  bindEvents() {
    const submitButton = document.getElementById("submit-comment-button");
    const commentText = document.getElementById("comment-text");
    const charCount = document.getElementById("char-count");
    const showFormBtn = document.getElementById("show-review-form-btn");
    const commentForm = document.getElementById("comment-form");
    const cancelBtn = document.getElementById("cancel-review-btn");

    if (showFormBtn && commentForm) {
      showFormBtn.addEventListener("click", () => {
        // Check authentication when trying to show the form
        if (!JWTManager.isAuthenticated() || JWTManager.isTokenExpired()) {
          alert("You must be logged in to submit a review.");
          window.location.href = "/IRI_LilKartoffel/login";
          return;
        }
        
        // Show the form and hide the button
        commentForm.style.display = "block";
        showFormBtn.style.display = "none";
      });
    }    if (commentText) {
      commentText.addEventListener("input", () => {
        const length = commentText.value.length;
        if (charCount) {
          charCount.textContent = length;
        }

        // Don't disable the button - let validation handle it
        // This allows the user to click and see validation messages
        if (submitButton) {
          if (length === 0) {
            submitButton.classList.add('disabled-style');
          } else {
            submitButton.classList.remove('disabled-style');
          }
        }
      });
    }    if (submitButton) {
      submitButton.addEventListener("click", () => {
        this.submitReview();
      });
    }

    // Cancel button functionality
    if (cancelBtn && commentForm) {
      cancelBtn.addEventListener("click", () => {
        this.hideAndResetForm(commentForm, showFormBtn, commentText, charCount);
      });
    }
  }  hideAndResetForm(commentForm, showFormBtn, commentText, charCount) {
    // Hide the form and show the button again
    commentForm.style.display = "none";
    showFormBtn.style.display = "block";
    
    // Reset form content
    if (commentText) {
      commentText.value = "";
    }
    
    if (charCount) {
      charCount.textContent = "0";
    }
      // Reset submit button state
    const submitButton = document.getElementById("submit-comment-button");
    if (submitButton) {
      submitButton.classList.add('disabled-style');
    }
      // Reset uploaded pictures if picture upload manager exists
    if (this.pictureUpload && typeof this.pictureUpload.resetUploadedPictures === 'function') {
      this.pictureUpload.resetUploadedPictures();
    }
      // Reset trait ratings if trait rating manager exists  
    if (this.traitRating && typeof this.traitRating.resetTraitRatings === 'function') {
      this.traitRating.resetTraitRatings();    } else {
      // Fallback: reset ratings from DOM directly
      const ratingInputs = document.querySelectorAll('.trait-rating-item[data-rating]');
      ratingInputs.forEach(input => {
        input.dataset.rating = "0";
        // Also reset visual state if exists
        const stars = input.querySelectorAll('.star');
        if (stars) {
          stars.forEach(star => {
            star.classList.remove('filled');
            star.classList.add('empty');
          });
        }
      });
    }
  }
  submitReview() {
    const commentText = document.getElementById("comment-text");
    const description = commentText ? commentText.value.trim() : "";

    if (!description) {
      alert("Please write a review before submitting.");
      return;
    }

    const submitButton = document.getElementById("submit-comment-button");    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }    let traitRatings = [];
    let overallRatingValue = 0;

    // Check if trait rating is properly initialized and has the required methods
    if (!this.traitRating || typeof this.traitRating.getTraitRatings !== 'function' || typeof this.traitRating.getTotalTraitsCount !== 'function') {      console.error("TraitRating not properly initialized, falling back to basic validation");
      // For fallback, we can try to get ratings from DOM directly
      const ratingInputs = document.querySelectorAll('.trait-rating-item[data-rating]:not([data-rating="0"])');
      if (ratingInputs.length === 0) {
        alert("Please rate at least one trait before submitting.");
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Submit";
        }
        return;
      }
      
      // Build trait ratings from DOM for fallback
      const allTraitInputs = document.querySelectorAll('.trait-rating-item[data-rating]');
      let totalRating = 0;
      let ratedCount = 0;
      
      allTraitInputs.forEach(input => {
        const traitId = input.dataset.traitId;
        const rating = parseInt(input.dataset.rating) || 0;
        if (rating > 0) {
          traitRatings.push({
            trait_id: traitId,
            rating: rating
          });
          totalRating += rating;
          ratedCount++;
        }
      });
      
      if (ratedCount > 0) {
        overallRatingValue = totalRating / ratedCount;
      }
    } else {
      // Use new validation with all traits required
      traitRatings = this.traitRating.getTraitRatings();
      const totalTraits = this.traitRating.getTotalTraitsCount();

      // Check if all traits have been rated
      if (!this.traitRating.areAllTraitsRated()) {
        const ratedCount = traitRatings.length;
        alert(`Please rate all traits before submitting. You have rated ${ratedCount} out of ${totalTraits} traits.`);
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Submit";
        }
        return;
      }
      
      overallRatingValue = this.traitRating.calculateOverallRating();
    }

    if (
      !overallRatingValue ||
      overallRatingValue < 1 ||
      overallRatingValue > 5
    ) {
      alert(
        "Error calculating overall rating. Please try rating the traits again."
      );
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Submit";
      }
      return;
    }
    const reviewData = {
      entity_id: this.entityId,
      description: description,
      rating: overallRatingValue,
      trait_ratings: traitRatings,
      pictures: this.pictureUpload.getUploadedPictures(),    };

    JWTManager.authenticatedFetch("/IRI_LilKartoffel/api/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          // Show success message
          alert("Review sent successfully!");
          
          if (commentText) commentText.value = "";
          
          // Reset pictures and trait ratings if available
          if (this.pictureUpload && typeof this.pictureUpload.resetUploadedPictures === 'function') {
            this.pictureUpload.resetUploadedPictures();
          }
          
          if (this.traitRating && typeof this.traitRating.resetTraitRatings === 'function') {
            this.traitRating.resetTraitRatings();          } else {
            // Fallback: reset ratings from DOM directly
            const ratingInputs = document.querySelectorAll('.trait-rating-item[data-rating]');
            ratingInputs.forEach(input => {
              input.dataset.rating = "0";
              // Also reset visual state if exists
              const stars = input.querySelectorAll('.star');
              if (stars) {
                stars.forEach(star => {
                  star.classList.remove('filled');
                  star.classList.add('empty');
                });
              }
            });
          }

          // Hide form and show the "Write a Review" button again
          const commentForm = document.getElementById("comment-form");
          const showFormBtn = document.getElementById("show-review-form-btn");
          const charCount = document.getElementById("char-count");
          
          if (commentForm) commentForm.style.display = "none";
          if (showFormBtn) showFormBtn.style.display = "block";
          if (charCount) charCount.textContent = "0";

          document.dispatchEvent(new CustomEvent("reviewSubmitted"));
        } else {
          alert("Error: " + (data.error || "Failed to submit review"));
        }
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
        alert("Failed to submit review. Please try again.");
      })
      .finally(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Submit";
        }
      });
  }
}

window.ReviewForm = ReviewForm;
