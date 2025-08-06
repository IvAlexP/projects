function createRankingItem(entity, rank, type) {
  const item = document.createElement("div");
  item.className = "ranking-item";

  const rankBadge = document.createElement("div");
  rankBadge.className = `rank-badge rank-${rank <= 3 ? rank : 'other'}`;
  rankBadge.textContent = rank;

  const entityInfo = document.createElement("div");
  entityInfo.className = "entity-info";

  const entityName = document.createElement("h4");
  entityName.textContent = entity.name;
  const entityDetails = document.createElement("div");
  entityDetails.className = "entity-details";
  
  const entityCity = document.createElement("span");
  entityCity.className = "entity-city";
  entityCity.textContent = `City: ${entity.city}`;
  
  const entityCategory = document.createElement("span");
  entityCategory.className = "entity-category";
  entityCategory.textContent = `Category: ${entity.category_name || 'Unknown'}`;
  
  entityDetails.appendChild(entityCity);
  entityDetails.appendChild(entityCategory);

  const entityStats = document.createElement("div");
  entityStats.className = "entity-stats";
  
  if (type === "loved" || type === "hated" || type === "city") {
    const reviewsStatItem = document.createElement("span");
    reviewsStatItem.className = "stat-item";
    
    const reviewsIcon = document.createElement("span");
    reviewsIcon.className = "stat-icon";
    reviewsIcon.textContent = "💬";
    
    const reviewsText = document.createTextNode(` ${entity.review_count || 0} reviews`);
    
    reviewsStatItem.appendChild(reviewsIcon);
    reviewsStatItem.appendChild(reviewsText);
    
    const ratingStatItem = document.createElement("span");
    ratingStatItem.className = "stat-item";
    
    const ratingIcon = document.createElement("span");
    ratingIcon.className = "stat-icon";
    ratingIcon.textContent = "⭐";
    
    const ratingText = document.createTextNode(` ${parseFloat(entity.average_rating || 0).toFixed(1)}`);
    
    ratingStatItem.appendChild(ratingIcon);
    ratingStatItem.appendChild(ratingText);
    
    entityStats.appendChild(reviewsStatItem);
    entityStats.appendChild(ratingStatItem);
  }

  entityInfo.appendChild(entityName);
  entityInfo.appendChild(entityDetails);
  item.appendChild(rankBadge);
  item.appendChild(entityInfo);
  item.appendChild(entityStats);

  return item;
}

window.createRankingItem = createRankingItem;
