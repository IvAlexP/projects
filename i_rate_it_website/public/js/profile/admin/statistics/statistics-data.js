async function loadOverviewStats() {
  try {
    const response = await fetch("/IRI_LilKartoffel/api/statistics/overview");
    const data = await response.json();

    if (data.status === 200 && data.stats) {
      const totalEntitiesEl = document.getElementById("total-entities");
      const totalReviewsEl = document.getElementById("total-reviews");
      const totalUsersEl = document.getElementById("total-users");
      const totalCitiesEl = document.getElementById("total-cities");
      
      if (totalEntitiesEl) totalEntitiesEl.textContent = data.stats.total_entities || 0;
      if (totalReviewsEl) totalReviewsEl.textContent = data.stats.total_reviews || 0;
      if (totalUsersEl) totalUsersEl.textContent = data.stats.total_users || 0;
      if (totalCitiesEl) totalCitiesEl.textContent = data.stats.total_cities || 0;
    } else {
      console.error("Invalid response format:", data);
      const totalEntitiesEl = document.getElementById("total-entities");
      const totalReviewsEl = document.getElementById("total-reviews");
      const totalUsersEl = document.getElementById("total-users");
      const totalCitiesEl = document.getElementById("total-cities");
      
      if (totalEntitiesEl) totalEntitiesEl.textContent = "0";
      if (totalReviewsEl) totalReviewsEl.textContent = "0";
      if (totalUsersEl) totalUsersEl.textContent = "0";
      if (totalCitiesEl) totalCitiesEl.textContent = "0";
    }} catch (error) {
    console.error("Error loading overview stats:", error);
    const totalEntitiesEl = document.getElementById("total-entities");
    const totalReviewsEl = document.getElementById("total-reviews");
    const totalUsersEl = document.getElementById("total-users");
    const totalCitiesEl = document.getElementById("total-cities");
    
    if (totalEntitiesEl) totalEntitiesEl.textContent = "Error";
    if (totalReviewsEl) totalReviewsEl.textContent = "Error";
    if (totalUsersEl) totalUsersEl.textContent = "Error";
    if (totalCitiesEl) totalCitiesEl.textContent = "Error";
  }
}

async function loadRankings() {
  loadTabData("most-loved");
}

async function loadTabData(tab) {
  switch (tab) {
    case "most-loved":
      await loadMostLovedRankings();
      break;
    case "most-hated":
      await loadMostHatedRankings();
      break;
    case "by-city":
      break; 
  }
}

async function loadMostLovedRankings() {
  try {
    const response = await fetch("/IRI_LilKartoffel/api/statistics/most-loved");
    const data = await response.json();    const listContainer = document.getElementById("most-loved-list");
    while (listContainer.firstChild) {
      listContainer.removeChild(listContainer.firstChild);
    }

    if (data.status === 200 && data.rankings && data.rankings.length > 0) {
      data.rankings.forEach((entity, index) => {
        const rankingItem = createRankingItem(entity, index + 1, "loved");
        listContainer.appendChild(rankingItem);
      });
    } else {
      const noDataDiv = document.createElement("div");
      noDataDiv.className = "no-data";
      noDataDiv.textContent = "No data available";
      listContainer.appendChild(noDataDiv);
    }
  } catch (error) {
    console.error("Error loading most loved rankings:", error);
    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.textContent = "Error loading data";
    const listContainer = document.getElementById("most-loved-list");
    while (listContainer.firstChild) {
      listContainer.removeChild(listContainer.firstChild);
    }
    listContainer.appendChild(errorDiv);
  }
}

async function loadMostHatedRankings() {
  try {
    const response = await fetch("/IRI_LilKartoffel/api/statistics/most-hated");
    const data = await response.json();    const listContainer = document.getElementById("most-hated-list");
    while (listContainer.firstChild) {
      listContainer.removeChild(listContainer.firstChild);
    }

    if (data.status === 200 && data.rankings && data.rankings.length > 0) {
      data.rankings.forEach((entity, index) => {
        const rankingItem = createRankingItem(entity, index + 1, "hated");
        listContainer.appendChild(rankingItem);
      });
    } else {
      const noDataDiv = document.createElement("div");
      noDataDiv.className = "no-data";
      noDataDiv.textContent = "No data available";
      listContainer.appendChild(noDataDiv);
    }
  } catch (error) {
    console.error("Error loading most hated rankings:", error);
    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.textContent = "Error loading data";
    const listContainer = document.getElementById("most-hated-list");
    while (listContainer.firstChild) {
      listContainer.removeChild(listContainer.firstChild);
    }
    listContainer.appendChild(errorDiv);
  }
}

async function loadCities() {
  try {
    const response = await fetch("/IRI_LilKartoffel/api/statistics/cities");
    const data = await response.json();

    const citySelect = document.getElementById("city-select");
    
    if (data.status === 200 && data.cities) {
      data.cities.forEach((cityObj) => {
        const option = document.createElement("option");
        option.value = cityObj.city;
        option.textContent = cityObj.city;
        citySelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error loading cities:", error);
  }
}

async function loadCityRankings(city) {
  try {
    const response = await fetch(`/IRI_LilKartoffel/api/statistics/by-city?city=${encodeURIComponent(city)}`);
    const data = await response.json();    const listContainer = document.getElementById("by-city-list");
    while (listContainer.firstChild) {
      listContainer.removeChild(listContainer.firstChild);
    }

    if (data.status === 200 && data.rankings && data.rankings.length > 0) {
      data.rankings.forEach((entity, index) => {
        const rankingItem = createRankingItem(entity, index + 1, "city");
        listContainer.appendChild(rankingItem);
      });
    } else {
      const noDataDiv = document.createElement("div");
      noDataDiv.className = "no-data";
      noDataDiv.textContent = "No entities found for this city";
      listContainer.appendChild(noDataDiv);
    }
  } catch (error) {
    console.error("Error loading city rankings:", error);
    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.textContent = "Error loading data";
    const listContainer = document.getElementById("by-city-list");
    while (listContainer.firstChild) {
      listContainer.removeChild(listContainer.firstChild);
    }
    listContainer.appendChild(errorDiv);
  }
}

window.loadOverviewStats = loadOverviewStats;
window.loadRankings = loadRankings;
window.loadTabData = loadTabData;
window.loadMostLovedRankings = loadMostLovedRankings;
window.loadMostHatedRankings = loadMostHatedRankings;
window.loadCities = loadCities;
window.loadCityRankings = loadCityRankings;
