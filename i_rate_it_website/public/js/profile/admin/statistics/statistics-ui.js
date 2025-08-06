function createStatisticsExportContainer() {
  if (document.getElementById("statistics-export-container")) {
    return; 
  }
  
  const container = document.createElement("div");
  container.id = "statistics-export-container";
  container.className = "statistics-export-container";
  
  const containerHeader = document.createElement("div");
  containerHeader.className = "statistics-export-header";
  const headerTitle = document.createElement("h3");
  headerTitle.appendChild(document.createTextNode("Statistics & Export"));

  const closeButton = document.createElement("button");
  closeButton.id = "close-statistics-export";
  closeButton.className = "close";
  closeButton.textContent = "X";
  containerHeader.appendChild(headerTitle);
  containerHeader.appendChild(closeButton);
  
  const mainContent = document.createElement("div");
  mainContent.className = "statistics-export-content";
  const statsSection = document.createElement("div");
  statsSection.className = "stats-section";
  
  const statsTitle = document.createElement("h4");
  statsTitle.className = "section-title";
  statsTitle.textContent = "Overview";
  
  const statsGrid = document.createElement("div");
  statsGrid.className = "stats-grid";
  
  const statsData = [
    { id: "total-entities", icon: "🍽️", label: "Total Entities" },
    { id: "total-reviews", icon: "💬", label: "Total Reviews" },
    { id: "total-users", icon: "👥", label: "Active Users" },
    { id: "total-cities", icon: "🏙️", label: "Cities" }
  ];
  
  statsData.forEach(stat => {
    const statCard = document.createElement("div");
    statCard.className = "stat-card";
    
    const statIcon = document.createElement("div");
    statIcon.className = "stat-icon";
    statIcon.textContent = stat.icon;
    
    const statContent = document.createElement("div");
    statContent.className = "stat-content";
    
    const statNumber = document.createElement("h3");
    statNumber.className = "stat-number";
    statNumber.id = stat.id;
    statNumber.textContent = "-";
    
    const statLabel = document.createElement("p");
    statLabel.className = "stat-label";
    statLabel.textContent = stat.label;
    
    statContent.appendChild(statNumber);
    statContent.appendChild(statLabel);
    statCard.appendChild(statIcon);
    statCard.appendChild(statContent);
    statsGrid.appendChild(statCard);
  });
  
  statsSection.appendChild(statsTitle);
  statsSection.appendChild(statsGrid);
  const rankingsSection = document.createElement("div");
  rankingsSection.className = "rankings-section";
  
  const rankingsTitle = document.createElement("h4");
  rankingsTitle.className = "section-title";
  rankingsTitle.textContent = "Entity Rankings";
  
  const rankingTabs = document.createElement("div");
  rankingTabs.className = "ranking-tabs";
  
  const tabsData = [
    { id: "most-loved", icon: "😍", label: "Most Loved", active: true },
    { id: "most-hated", icon: "😠", label: "Most Hated", active: false },
    { id: "by-city", icon: "🏙️", label: "By City", active: false }
  ];

  tabsData.forEach(tab => {
    const tabBtn = document.createElement("button");
    tabBtn.className = tab.active ? "tab-btn button-full active" : "tab-btn button-border";
    tabBtn.setAttribute("data-tab", tab.id);
    const tabIcon = document.createElement("span");
    tabIcon.className = "tab-icon";
    tabIcon.textContent = tab.icon;
    tabBtn.appendChild(tabIcon);
    tabBtn.appendChild(document.createTextNode(tab.label));
    rankingTabs.appendChild(tabBtn);
  });
  
  // Move city selector here, after tab selector
  const citySelector = document.createElement("div");
  citySelector.className = "city-selector";
  citySelector.style.display = "none"; // Hide by default
  const citySelect = document.createElement("select");
  citySelect.id = "city-select";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a city...";
  citySelect.appendChild(defaultOption);
  citySelector.appendChild(citySelect);

  // Create tab contents
  const mostLovedContent = document.createElement("div");
  mostLovedContent.className = "tab-content active";
  mostLovedContent.id = "most-loved";
  
  const mostLovedList = document.createElement("div");
  mostLovedList.className = "ranking-list";
  mostLovedList.id = "most-loved-list";
  
  const mostLovedLoading = document.createElement("div");
  mostLovedLoading.className = "loading";
  mostLovedLoading.textContent = "Loading...";
  mostLovedList.appendChild(mostLovedLoading);
  mostLovedContent.appendChild(mostLovedList);
  
  const mostHatedContent = document.createElement("div");
  mostHatedContent.className = "tab-content";
  mostHatedContent.id = "most-hated";
  
  const mostHatedList = document.createElement("div");
  mostHatedList.className = "ranking-list";
  mostHatedList.id = "most-hated-list";
  
  const mostHatedLoading = document.createElement("div");
  mostHatedLoading.className = "loading";
  mostHatedLoading.textContent = "Loading...";
  mostHatedList.appendChild(mostHatedLoading);
  mostHatedContent.appendChild(mostHatedList);
  
  const byCityContent = document.createElement("div");
  byCityContent.className = "tab-content";
  byCityContent.id = "by-city";
  
  const byCityList = document.createElement("div");
  byCityList.className = "ranking-list";
  byCityList.id = "by-city-list";
  
  const byCityLoading = document.createElement("div");
  byCityLoading.className = "loading";
  byCityLoading.textContent = "Loading...";
  byCityList.appendChild(byCityLoading);
  
  byCityContent.appendChild(byCityList);

  rankingsSection.appendChild(rankingsTitle);
  rankingsSection.appendChild(rankingTabs);
  rankingsSection.appendChild(citySelector); // Insert city selector here
  rankingsSection.appendChild(mostLovedContent);
  rankingsSection.appendChild(mostHatedContent);
  rankingsSection.appendChild(byCityContent);
  const exportSection = document.createElement("div");
  exportSection.className = "export-section";
  
  const exportTitle = document.createElement("h4");
  exportTitle.className = "section-title";
  exportTitle.textContent = "Data Export";
  
  const exportGrid = document.createElement("div");
  exportGrid.className = "export-grid";
  
  const exportData = [
    {
      icon: "📊",
      title: "Statistics Report",
      description: "Complete overview of all entities and reviews",
      buttons: [
        { type: "stats", format: "csv", icon: "📄", label: "CSV", class: "csv-btn" },
        { type: "stats", format: "pdf", icon: "📋", label: "PDF", class: "pdf-btn" }
      ]
    },
    {
      icon: "📈",
      title: "Entity Rankings",
      description: "Most loved and most hated entities ranking",
      buttons: [
        { type: "rankings", format: "csv", icon: "📄", label: "CSV", class: "csv-btn" },
        { type: "rankings", format: "pdf", icon: "📋", label: "PDF", class: "pdf-btn" }
      ]
    },
    {
      icon: "🔗",
      title: "RSS Feed",
      description: "Live feed of entity rankings updates",
      buttons: [
        { type: "rss", format: null, icon: "🔗", label: "RSS", class: "rss-btn" },
        { type: "copy", format: null, icon: "📋", label: "Link", class: "copy-btn", id: "copy-rss-link" }
      ]
    }
  ];
  
  exportData.forEach(card => {
    const exportCard = document.createElement("div");
    exportCard.className = "export-card";
    
    const exportIcon = document.createElement("div");
    exportIcon.className = "export-icon";
    exportIcon.textContent = card.icon;
    
    const cardTitle = document.createElement("h5");
    cardTitle.textContent = card.title;
    
    const cardDescription = document.createElement("p");
    cardDescription.textContent = card.description;
    
    const exportButtons = document.createElement("div");
    exportButtons.className = "export-buttons";

    card.buttons.forEach((btn, idx) => {
      const button = document.createElement("button");
      button.className = idx === 0 ? "button-border" : "button-full";
      if (btn.type) button.setAttribute("data-type", btn.type);
      if (btn.format) button.setAttribute("data-format", btn.format);
      if (btn.id) button.id = btn.id;
      button.appendChild(document.createTextNode(btn.label));
      exportButtons.appendChild(button);
    });
    
    exportCard.appendChild(exportIcon);
    exportCard.appendChild(cardTitle);
    exportCard.appendChild(cardDescription);
    exportCard.appendChild(exportButtons);
    exportGrid.appendChild(exportCard);
  });
  
  exportSection.appendChild(exportTitle);
  exportSection.appendChild(exportGrid);


  mainContent.appendChild(statsSection);
  mainContent.appendChild(rankingsSection);
  mainContent.appendChild(exportSection);

  container.appendChild(containerHeader);
  container.appendChild(mainContent);
  
  const roleContainer = document.getElementById("role-specific-sections");
  if (roleContainer) {
    roleContainer.appendChild(container);
  } else {
    document.body.appendChild(container);
  }
  
  document.getElementById("close-statistics-export").addEventListener("click", () => {
    document.getElementById("statistics-export-container").style.display = "none";
  });
}

function initializeStatisticsTabs() {
  const tabButtons = document.querySelectorAll("#statistics-export-container .tab-btn");
  const tabContents = document.querySelectorAll("#statistics-export-container .tab-content");
  const citySelector = document.querySelector("#statistics-export-container .city-selector");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");
      tabButtons.forEach((btn) => {
        btn.classList.remove("active", "button-full");
        btn.classList.add("button-border");
      });
      tabContents.forEach((content) => content.classList.remove("active"));
      this.classList.add("active", "button-full");
      this.classList.remove("button-border");
      document.getElementById(targetTab).classList.add("active");
      // Show city selector only for 'by-city' tab
      if (citySelector) {
        citySelector.style.display = (targetTab === "by-city") ? "block" : "none";
      }
      // Only call loadTabData if it's available
      if (typeof window.loadTabData === "function") {
        loadTabData(targetTab);
      } else {
        console.warn("loadTabData function not available");
      }
    });
  });
  // Show city selector if by-city is default active
  const activeTab = document.querySelector("#statistics-export-container .tab-btn.active");
  if (activeTab && citySelector) {
    citySelector.style.display = (activeTab.getAttribute("data-tab") === "by-city") ? "block" : "none";
  }
  const citySelect = document.getElementById("city-select");
  if (citySelect) {
    citySelect.addEventListener("change", function () {
      if (this.value && typeof window.loadCityRankings === "function") {
        loadCityRankings(this.value);
      }
    });
    if (typeof window.loadCities === "function") {
      loadCities();
    }
  }
}

function initializeStatisticsExports() {
  const exportButtons = document.querySelectorAll("#statistics-export-container [data-type], #statistics-export-container #copy-rss-link");
  exportButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const type = this.getAttribute("data-type");
      const format = this.getAttribute("data-format");
      if (type === "rss" && typeof window.handleRSSExport === "function") {
        handleRSSExport();
      } else if (this.id === "copy-rss-link" && typeof window.copyRSSLink === "function") {
        copyRSSLink();
      } else if (type && format && typeof window.exportData === "function") {
        exportData(type, format);
      }
    });
  });
}

window.createStatisticsExportContainer = createStatisticsExportContainer;
window.initializeStatisticsTabs = initializeStatisticsTabs;
window.initializeStatisticsExports = initializeStatisticsExports;
