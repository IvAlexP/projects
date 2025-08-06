class TraitRating {
  constructor() {
    this.traits = [];
    this.traitRatings = {};
  }
  async loadCategoryTraits(categoryId) {
    try {
      const response = await fetch(
        `/IRI_LilKartoffel/api/traits/${categoryId}`
      );
      const data = await response.json();
      console.log("Traits response:", data);
      if (data.status == 200 && data.traits) {
        this.traits = data.traits;
        this.displayTraits(data.traits);
        return true; // Indicate success
      } else {
        console.error("Error loading traits:", data.error || "Unknown error");
        return false;
      }
    } catch (error) {
      console.error("Error loading traits:", error);
      return false;
    }
  }

  displayTraits(traits) {
    const traitsList = document.getElementById("traits-list");

    if (traitsList && traits && traits.length > 0) {
      traitsList.innerHTML = "";

      traits.forEach((trait) => {
        const traitDiv = document.createElement("div");
        traitDiv.className = "trait-rating-item";
        traitDiv.dataset.traitId = trait.id;
        traitDiv.dataset.rating = "0";

        const traitLabel = document.createElement("label");
        traitLabel.textContent = trait.name;
        traitLabel.className = "trait-label";

        const starsContainer = document.createElement("div");
        starsContainer.className = "stars-container";
        for (let i = 1; i <= 5; i++) {
          const star = document.createElement("span");
          star.className = "star empty";
          star.innerHTML = "&#9733;";
          star.dataset.rating = i;

          star.addEventListener("click", () => {
            this.setTraitRating(traitDiv, i);
          });

          star.addEventListener("mouseover", () => {
            this.highlightStars(starsContainer, i);
          });

          star.addEventListener("mouseout", () => {
            const currentRating = parseInt(traitDiv.dataset.rating);
            this.highlightStars(starsContainer, currentRating);
          });

          starsContainer.appendChild(star);
        }

        traitDiv.appendChild(traitLabel);
        traitDiv.appendChild(starsContainer);
        traitsList.appendChild(traitDiv);
      });
    }
  }

  setTraitRating(traitDiv, rating) {
    const traitId = traitDiv.dataset.traitId;
    traitDiv.dataset.rating = rating;
    this.traitRatings[traitId] = rating;

    const starsContainer = traitDiv.querySelector(".stars-container");
    this.highlightStars(starsContainer, rating);

    this.calculateAndUpdateOverallRating();
  }
  highlightStars(container, rating) {
    const stars = container.querySelectorAll(".star");
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add("filled");
        star.classList.remove("empty");
      } else {
        star.classList.remove("filled");
        star.classList.add("empty");
      }
    });
  }

  getTraitRatings() {
    const traitRatings = [];
    const traitItems = document.querySelectorAll(".trait-rating-item");

    console.log("Found trait items:", traitItems.length);

    traitItems.forEach((item) => {
      const traitId = item.dataset.traitId;
      const rating = item.dataset.rating;
      console.log(`Trait ${traitId}: rating ${rating}`);

      if (traitId && rating && rating > 0) {
        traitRatings.push({
          trait_id: parseInt(traitId),
          rating: parseInt(rating),
        });
      }
    });

    return traitRatings;
  }

  // Get total number of traits available for rating
  getTotalTraitsCount() {
    return this.traits.length;
  }

  // Check if all traits have been rated
  areAllTraitsRated() {
    const totalTraits = this.getTotalTraitsCount();
    const ratedTraits = this.getTraitRatings().length;
    return totalTraits === ratedTraits && totalTraits > 0;
  }

  calculateOverallRating() {
    const traitItems = document.querySelectorAll(".trait-rating-item");
    let totalRating = 0;
    let ratedTraits = 0;

    traitItems.forEach((item) => {
      const rating = parseInt(item.dataset.rating);
      if (rating > 0) {
        totalRating += rating;
        ratedTraits++;
      }
    });

    return ratedTraits > 0 ? Math.round(totalRating / ratedTraits) : 0;
  }

  calculateAndUpdateOverallRating() {
    const averageRating = this.calculateOverallRating();
    this.setOverallRating(averageRating);
  }

  setOverallRating(rating) {
    const overallRating = document.getElementById("overall-rating");
    if (overallRating) {
      overallRating.dataset.rating = rating;
      this.highlightOverallStars(rating);
    }
  }

  highlightOverallStars(rating) {
    const overallRating = document.getElementById("overall-rating");
    if (overallRating) {
      const stars = overallRating.querySelectorAll(".star");
      stars.forEach((star, index) => {
        if (index < rating) {
          star.classList.add("filled");
        } else {
          star.classList.remove("filled");
        }      });
    }
  }

  getTotalTraitsCount() {
    return this.traits.length;
  }

  areAllTraitsRated() {
    const totalTraits = this.getTotalTraitsCount();
    const ratedTraits = Object.keys(this.traitRatings).length;
    return totalTraits > 0 && ratedTraits === totalTraits;
  }
  resetTraitRatings() {
    const traitItems = document.querySelectorAll(".trait-rating-item");
    traitItems.forEach((item) => {
      item.dataset.rating = "0";
      const stars = item.querySelectorAll(".star");
      stars.forEach((star) => {
        star.classList.remove("filled");
        star.classList.add("empty");
      });
    });

    this.traitRatings = {};
    this.setOverallRating(0);
  }
}

window.TraitRating = TraitRating;
