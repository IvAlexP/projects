class VoteManager {
  static addVoteButtons(reviewDiv, review) {
    const header =
      reviewDiv.querySelector(".review-header") ||
      reviewDiv.querySelector(".reply-header");

    if (!header) {
      console.warn("No header found for vote buttons");
      return;
    }

    const voteButtons = document.createElement("div");
    voteButtons.className = "vote-buttons";

    const likeBtn = document.createElement("button");
    likeBtn.className = "vote-btn like-btn";
    likeBtn.innerHTML = "&#128077; ";
    
    const likeCount = document.createElement("span");
    likeCount.className = "vote-count";
    likeCount.textContent = review.votes?.likes || 0;
    likeBtn.appendChild(likeCount);    likeBtn.addEventListener("click", () =>
      this.voteReview(review.id, "like", likeBtn, dislikeBtn)
    );

    const dislikeBtn = document.createElement("button");
    dislikeBtn.className = "vote-btn dislike-btn";
    dislikeBtn.innerHTML = "&#128078; ";

    const dislikeCount = document.createElement("span");
    dislikeCount.className = "vote-count";
    dislikeCount.textContent = review.votes?.dislikes || 0;
    dislikeBtn.appendChild(dislikeCount);
    dislikeBtn.addEventListener("click", () =>
      this.voteReview(review.id, "dislike", dislikeBtn, likeBtn)
    );

    voteButtons.appendChild(likeBtn);
    voteButtons.appendChild(dislikeBtn);
    header.appendChild(voteButtons);

    if (JWTManager.isAuthenticated() && !JWTManager.isTokenExpired()) {
      this.checkUserVote(review.id, likeBtn, dislikeBtn);
    }
  }  static async voteReview(reviewId, voteType, clickedBtn, otherBtn) {
    if (!JWTManager.isAuthenticated() || JWTManager.isTokenExpired()) {
      alert("You must be logged in to vote on reviews.");
      window.location.href = "/IRI_LilKartoffel/login";
      return;
    }

    clickedBtn.disabled = true;
    
    // Check if the clicked button is already active (selected)
    const isAlreadyActive = clickedBtn.classList.contains("active");
    
    try {
      let response;
      
      if (isAlreadyActive) {
        // If button is already active, remove the vote
        response = await JWTManager.authenticatedFetch(
          "/IRI_LilKartoffel/api/review-remove-vote",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              review_id: reviewId,
            }),
          }
        );
      } else {
        // If button is not active, add/change the vote
        response = await JWTManager.authenticatedFetch(
          "/IRI_LilKartoffel/api/review-vote",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              review_id: reviewId,
              vote_type: voteType,
            }),
          }
        );
      }

      const data = await response.json();

      if (data.status >= 200 && data.status < 300) {
        // Check if votes property exists in response
        if (data.votes === undefined) {
          alert("Error: Server response missing vote counts");
          return;
        }
        
        // Update vote counts - identify buttons more explicitly
        let likeBtn, dislikeBtn;
        
        if (clickedBtn.classList.contains("like-btn")) {
          likeBtn = clickedBtn;
          dislikeBtn = otherBtn;
        } else {
          likeBtn = otherBtn;
          dislikeBtn = clickedBtn;
        }
        
        // Update the counts
        const likeCountElement = likeBtn.querySelector(".vote-count");
        const dislikeCountElement = dislikeBtn.querySelector(".vote-count");
        
        if (likeCountElement) likeCountElement.textContent = data.votes.likes;
        if (dislikeCountElement) dislikeCountElement.textContent = data.votes.dislikes;

        // Reset all active states
        likeBtn.classList.remove("active");
        dislikeBtn.classList.remove("active");

        // Set active state based on user's current vote
        if (data.user_vote === "like") {
          likeBtn.classList.add("active");
        } else if (data.user_vote === "dislike") {
          dislikeBtn.classList.add("active");
        }
        // If user_vote is null, both buttons remain inactive (vote was removed)
      } else {
        alert("Error: " + (data.error || "Failed to process vote"));
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to process vote. Please try again.");
    } finally {
      clickedBtn.disabled = false;
    }
  }

  static async checkUserVote(reviewId, likeBtn, dislikeBtn) {
    try {
      const response = await JWTManager.authenticatedFetch(
        `/IRI_LilKartoffel/api/review-user-vote/${reviewId}`
      );
      const data = await response.json();

      if (data.status >= 200 && data.status < 300) {
        if (data.user_vote === "like") {
          likeBtn.classList.add("active");
        } else if (data.user_vote === "dislike") {
          dislikeBtn.classList.add("active");
        }
      }
    } catch (error) {
      console.error("Error checking user vote:", error);
    }
  }
}

window.VoteManager = VoteManager;
