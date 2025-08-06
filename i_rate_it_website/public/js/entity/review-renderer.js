class ReviewRenderer {
  static createReviewElement(review) {
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review-item";
    reviewDiv.dataset.reviewId = review.id;

    const reviewHeader = document.createElement("div");
    reviewHeader.className = "review-header";

    const reviewHeaderLeft = document.createElement("div");
    reviewHeaderLeft.className = "review-header-left";
    const userName = document.createElement("span");
    userName.textContent = review.user_name;
    userName.className = "review-user";
    const averageRating = document.createElement("span");
    averageRating.className = "review-rating";
    const rating = Math.round(review.rating || 0);

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.innerHTML = "&#9733;";
      star.className = i <= rating ? "star filled" : "star empty";
      averageRating.appendChild(star);
    }

    averageRating.title = `Average rating: ${rating}/5`;
    const reviewDate = document.createElement("span");
    reviewDate.className = "review-date";
    if (review.created_at) {
      const date = new Date(review.created_at);
      reviewDate.textContent = date.toLocaleString("ro-RO", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    reviewHeaderLeft.appendChild(userName);
    reviewHeaderLeft.appendChild(averageRating);
    reviewHeaderLeft.appendChild(reviewDate);
    reviewHeader.appendChild(reviewHeaderLeft);

    const reportIcon = document.createElement('span');
    reportIcon.className = 'review-report-icon';
    reportIcon.title = 'Report review';
    reportIcon.textContent = '!';
    reportIcon.onclick = () => window.openReportAlert(review.id);

    const reviewText = document.createElement("p");
    reviewText.className = "review-text";

    const isLongDescription = review.description.length > 200;
    const hasImages = review.pictures && review.pictures.length > 0;
    const hasTraits = review.traits && review.traits.length > 0;
    const needsShowMore = isLongDescription || hasImages || hasTraits;

    if (isLongDescription) {
      reviewText.textContent = review.description.substring(0, 200) + "...";
    } else {
      reviewText.textContent = review.description;
    }

    const reviewTextWrapper = document.createElement('div');
    reviewTextWrapper.style.display = 'flex';
    reviewTextWrapper.style.alignItems = 'center';
    reviewTextWrapper.appendChild(reportIcon);
    reviewTextWrapper.appendChild(reviewText);

    reviewDiv.appendChild(reviewHeader);
    reviewDiv.appendChild(reviewTextWrapper);

    if (window.VoteManager) {
      window.VoteManager.addVoteButtons(reviewDiv, review);
    }

    if (needsShowMore) {
      this.addExpandableContent(
        reviewDiv,
        review,
        reviewText,
        isLongDescription,
        hasTraits,
        hasImages
      );
    }
    const replyBtn = document.createElement("button");
    replyBtn.id = `reply-btn-${review.id}`;
    replyBtn.textContent = "Reply";
    replyBtn.className = "action-btn-base action-btn";
    replyBtn.addEventListener("click", function () {
      window.replyManager.toggleReplyForm(review.id, reviewDiv);
    });

    reviewDiv.appendChild(replyBtn);

    if (review.replies && review.replies.length > 0) {
      this.addRepliesSection(reviewDiv, review);
    }

    return reviewDiv;
  }
  static createReplyElement(reply, depth = 1) {
    const replyDiv = document.createElement("div");
    replyDiv.className = "reply-item";
    replyDiv.dataset.reviewId = reply.id;

    replyDiv.style.marginLeft = `${depth * 20}px`;
    replyDiv.style.borderLeft = `2px solid #e0e0e0`;
    replyDiv.style.paddingLeft = "10px";
    const replyHeader = document.createElement("div");
    replyHeader.className = "reply-header";

    const replyHeaderLeft = document.createElement("div");
    replyHeaderLeft.className = "reply-header-left";

    const replyUserName = document.createElement("span");
    replyUserName.textContent = reply.user_name;
    replyUserName.className = "reply-user";
    const replyDate = document.createElement("span");
    replyDate.className = "reply-date";
    if (reply.created_at) {
      const date = new Date(reply.created_at);
      replyDate.textContent = date.toLocaleString("ro-RO", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    replyHeaderLeft.appendChild(replyUserName);
    replyHeaderLeft.appendChild(replyDate);
    replyHeader.appendChild(replyHeaderLeft);

    const reportIcon = document.createElement('span');
    reportIcon.className = 'review-report-icon';
    reportIcon.textContent = '!';
    reportIcon.onclick = () => window.openReportAlert(reply.id);

    const replyText = document.createElement("p");
    replyText.textContent = reply.description;
    replyText.className = "reply-text";

    const replyTextWrapper = document.createElement('div');
    replyTextWrapper.style.display = 'flex';
    replyTextWrapper.style.alignItems = 'center';
    replyTextWrapper.appendChild(reportIcon);
    replyTextWrapper.appendChild(replyText);

    replyDiv.appendChild(replyHeader);
    replyDiv.appendChild(replyTextWrapper);
    if (reply.pictures && reply.pictures.length > 0) {
      const replyImagesContainer = document.createElement("div");
      replyImagesContainer.className = "comment-images";
      const imageSources = reply.pictures.map(
        (picture) => "/IRI_LilKartoffel/public" + picture.path
      );

      reply.pictures.forEach((picture, index) => {
        const img = document.createElement("img");
        img.src = "/IRI_LilKartoffel/public" + picture.path;
        img.alt = `Reply image ${index + 1}`;
        img.className = "comment-image";

        img.addEventListener("click", function () {
          window.imageViewer.open(img.src, imageSources);
        });

        replyImagesContainer.appendChild(img);
      });

      replyDiv.appendChild(replyImagesContainer);
    }

    window.VoteManager.addVoteButtons(replyDiv, reply);
    const replyBtn = document.createElement("button");
    replyBtn.id = `reply-btn-${reply.id}`;
    replyBtn.textContent = "Reply";
    replyBtn.className = "action-btn-base action-btn";
    replyBtn.addEventListener("click", function () {
      window.replyManager.toggleReplyForm(reply.id, replyDiv);
    });

    replyDiv.appendChild(replyBtn);

    if (reply.replies && reply.replies.length > 0) {
      this.addNestedRepliesSection(replyDiv, reply, depth);
    }

    return replyDiv;
  }

  static addRepliesSection(reviewDiv, review) {
    if (!review.replies || review.replies.length === 0) return;
    const showRepliesBtn = document.createElement("button");
    showRepliesBtn.id = `show-replies-btn-${review.id}`;
    showRepliesBtn.textContent = `Show (${review.replies.length})`;
    showRepliesBtn.className = "action-btn-base action-btn-secondary";

    const repliesContainer = document.createElement("div");
    repliesContainer.className = "replies-container";
    repliesContainer.style.display = "none";

    review.replies.forEach((reply) => {
      const replyDiv = this.createReplyElement(reply, 1);
      repliesContainer.appendChild(replyDiv);
    });
    showRepliesBtn.addEventListener("click", function () {
      const isHidden = repliesContainer.style.display === "none";
      if (isHidden) {
        repliesContainer.style.display = "block";
        showRepliesBtn.textContent = `Hide (${review.replies.length})`;
        reviewDiv.dataset.repliesVisible = "true";
      } else {
        repliesContainer.style.display = "none";
        showRepliesBtn.textContent = `Show (${review.replies.length})`;
        reviewDiv.dataset.repliesVisible = "false";
      }
    });

    reviewDiv.appendChild(showRepliesBtn);
    reviewDiv.appendChild(repliesContainer);
  }

  static addNestedRepliesSection(replyDiv, reply, depth) {
    if (!reply.replies || reply.replies.length === 0) return;
    const showNestedRepliesBtn = document.createElement("button");
    showNestedRepliesBtn.id = `show-nested-replies-btn-${reply.id}`;
    showNestedRepliesBtn.textContent = `Show More (${reply.replies.length})`;
    showNestedRepliesBtn.className = "action-btn-base action-btn-secondary";

    const nestedRepliesContainer = document.createElement("div");
    nestedRepliesContainer.className = "nested-replies-container";
    nestedRepliesContainer.style.display = "none";

    reply.replies.forEach((nestedReply) => {
      const nestedReplyDiv = this.createReplyElement(nestedReply, depth + 1);
      nestedRepliesContainer.appendChild(nestedReplyDiv);
    });
    showNestedRepliesBtn.addEventListener("click", function () {
      const isHidden = nestedRepliesContainer.style.display === "none";
      if (isHidden) {
        nestedRepliesContainer.style.display = "block";
        showNestedRepliesBtn.textContent = `Show Less (${reply.replies.length})`;
        replyDiv.dataset.nestedRepliesVisible = "true";
      } else {
        nestedRepliesContainer.style.display = "none";
        showNestedRepliesBtn.textContent = `Show More (${reply.replies.length})`;
        replyDiv.dataset.nestedRepliesVisible = "false";
      }
    });

    replyDiv.appendChild(showNestedRepliesBtn);
    replyDiv.appendChild(nestedRepliesContainer);
  }

  static addExpandableContent(
    reviewDiv,
    review,
    reviewText,
    isLongDescription,
    hasTraits,
    hasImages
  ) {
    const expandableContent = document.createElement("div");
    expandableContent.className = "expandable-content";

    if (isLongDescription) {
      const fullDescription = document.createElement("p");
      fullDescription.className = "review-text";
      fullDescription.textContent = review.description;
      fullDescription.style.display = "none";
      expandableContent.appendChild(fullDescription);
    }

    if (hasTraits) {
      const traitDetails = document.createElement("div");
      traitDetails.className = "trait-details";
      traitDetails.style.display = "none";

      review.traits.forEach((trait) => {
        const traitItem = document.createElement("div");
        traitItem.className = "trait-detail-item";

        const traitName = document.createElement("span");
        traitName.className = "trait-detail-name";
        traitName.textContent = trait.name;
        const traitRating = document.createElement("span");
        traitRating.className = "trait-detail-rating";

        for (let i = 1; i <= 5; i++) {
          const star = document.createElement("span");
          star.className = i <= trait.rating ? "star filled" : "star empty";
          star.innerHTML = "&#9733;";
          traitRating.appendChild(star);
        }

        traitRating.title = `${trait.rating}/5`;

        traitItem.appendChild(traitName);
        traitItem.appendChild(traitRating);
        traitDetails.appendChild(traitItem);
      });

      expandableContent.appendChild(traitDetails);
    }
    if (hasImages) {
      const imagesContainer = document.createElement("div");
      imagesContainer.className = "comment-images";
      imagesContainer.style.display = "none";
      const imageSources = review.pictures.map(
        (picture) => "/IRI_LilKartoffel/public" + picture.path
      );

      review.pictures.forEach((picture, index) => {
        const img = document.createElement("img");
        img.src = "/IRI_LilKartoffel/public" + picture.path;
        img.alt = `Review image ${index + 1}`;
        img.className = "comment-image";

        img.addEventListener("click", function () {
          window.imageViewer.open(img.src, imageSources);
        });

        imagesContainer.appendChild(img);
      });

      expandableContent.appendChild(imagesContainer);
    }

    const showMoreBtn = document.createElement("button");
    showMoreBtn.textContent = "Show more...";
    showMoreBtn.className = "show-more-btn";
    showMoreBtn.addEventListener("click", function () {
      const isExpanded = expandableContent.classList.contains("expanded");

      if (isExpanded) {
        expandableContent.classList.remove("expanded");
        if (isLongDescription) {
          reviewText.textContent = review.description.substring(0, 200) + "...";
          reviewText.style.display = "block";
          expandableContent.querySelector(".review-text").style.display =
            "none";
        }
        if (hasTraits) {
          expandableContent.querySelector(".trait-details").style.display =
            "none";
        }
        if (hasImages) {
          expandableContent.querySelector(".comment-images").style.display =
            "none";
        }
        showMoreBtn.textContent = "Show more...";
        showMoreBtn.style.marginTop = "0";
      } else {
        expandableContent.classList.add("expanded");
        if (isLongDescription) {
          reviewText.style.display = "none";
          expandableContent.querySelector(".review-text").style.display =
            "block";
          // Doar pentru text lung, adaugă margin-top
          showMoreBtn.style.marginTop = "1rem";
        } else {
          // Pentru imagini sau traits fără text lung, nu adăuga margin
          showMoreBtn.style.marginTop = "0";
        }
        if (hasTraits) {
          expandableContent.querySelector(".trait-details").style.display =
            "block";
        }
        if (hasImages) {
          expandableContent.querySelector(".comment-images").style.display =
            "block";
        }
        showMoreBtn.textContent = "Show less";
      }
    });

    reviewDiv.appendChild(showMoreBtn);
    reviewDiv.appendChild(expandableContent);
  }
}
window.ReviewRenderer = ReviewRenderer;
