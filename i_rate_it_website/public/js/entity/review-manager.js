class ReviewManager {
  constructor(entityManager) {
    this.entityManager = entityManager;
    this.allReviews = [];
    this.init();
  }

  init() {
    this.initializeReviewControls();
  }

  async loadReviews(entityId) {
    try {
      const response = await fetch(`/IRI_LilKartoffel/api/reviews/${entityId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const data = await response.json();
      console.log("Reviews response:", data);

      if (data.status == 200 && data.reviews) {
        this.allReviews = data.reviews;
        this.applyFiltersAndSort();
        return data.reviews;
      } else {
        console.error("Error fetching reviews:", data.error || "Unknown error");
        this.allReviews = [];
        this.displayFilteredReviews([]);
        return [];
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      this.allReviews = [];
      this.displayFilteredReviews([]);
      return [];
    }
  }

  displayFilteredReviews(reviews) {
    const reviewsList = document.querySelector(".comments-list");
    if (!reviewsList) return;

    reviewsList.innerHTML = "";

    if (!reviews || reviews.length === 0) {
      const noReviews = document.createElement("p");
      const hasAnyReviews =
        this.allReviews && this.allReviews.some((review) => !review.parent_id);

      if (hasAnyReviews) {
        noReviews.textContent = "No reviews match your current filters.";
      } else {
        noReviews.textContent =
          "No comments yet. Be the first to write a review!";
      }

      noReviews.className = "no-reviews";
      reviewsList.appendChild(noReviews);
    } else {
      reviews.forEach((review) => {
        if (!review.parent_id) {
          const reviewElement =
            window.ReviewRenderer.createReviewElement(review);
          reviewsList.appendChild(reviewElement);
        }
      });
    }
  }

  initializeReviewControls() {
    const ratingFilter = document.getElementById("rating-filter");
    const imageFilter = document.getElementById("image-filter");
    const sortBy = document.getElementById("sort-by");
    const searchInput = document.getElementById("review-search");

    if (ratingFilter) {
      ratingFilter.addEventListener("change", () => this.applyFiltersAndSort());
    }
    if (imageFilter) {
      imageFilter.addEventListener("change", () => this.applyFiltersAndSort());
    }
    if (sortBy) {
      sortBy.addEventListener("change", () => this.applyFiltersAndSort());
    }
    if (searchInput) {
      searchInput.addEventListener("input", () => this.applyFiltersAndSort());
    }
  }

  applyFiltersAndSort() {
    let filteredReviews = [...this.allReviews];

    filteredReviews = filteredReviews.filter((review) => !review.parent_id);

    const ratingFilter = document.getElementById("rating-filter")?.value;
    if (ratingFilter && ratingFilter !== "all") {
      const exactRating = parseInt(ratingFilter);
      filteredReviews = filteredReviews.filter((review) => {
        const reviewRating = Math.round(review.rating || 0);
        return reviewRating === exactRating;
      });
    }

    const imageFilter = document.getElementById("image-filter")?.value;
    if (imageFilter && imageFilter !== "all") {
      if (imageFilter === "with-images") {
        filteredReviews = filteredReviews.filter(
          (review) => review.pictures && review.pictures.length > 0
        );
      } else if (imageFilter === "no-images") {
        filteredReviews = filteredReviews.filter(
          (review) => !review.pictures || review.pictures.length === 0
        );
      }
    }

    const searchTerm = document
      .getElementById("review-search")
      ?.value.toLowerCase();
    if (searchTerm) {
      filteredReviews = filteredReviews.filter(
        (review) =>
          review.description.toLowerCase().includes(searchTerm) ||
          review.user_name.toLowerCase().includes(searchTerm)
      );
    }

    const sortBy = document.getElementById("sort-by")?.value || "date-desc";
    this.sortReviews(filteredReviews, sortBy);

    this.displayFilteredReviews(filteredReviews);
  }

  sortReviews(reviews, sortBy) {
    switch (sortBy) {
      case "date-desc":
        reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "date-asc":
        reviews.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case "rating-desc":
        reviews.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "rating-asc":
        reviews.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "helpful-desc":
        reviews.sort(
          (a, b) =>
            (b.votes?.likes || 0) -
            (b.votes?.dislikes || 0) -
            ((a.votes?.likes || 0) - (a.votes?.dislikes || 0))
        );
        break;
      case "helpful-asc":
        reviews.sort(
          (a, b) =>
            (a.votes?.likes || 0) -
            (a.votes?.dislikes || 0) -
            ((b.votes?.likes || 0) - (b.votes?.dislikes || 0))
        );
        break;
      default:
        reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  }
  getAllReviews() {
    return this.allReviews;
  }
}

window.ReviewManager = ReviewManager;
