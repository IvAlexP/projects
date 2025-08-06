function showStatisticsExport() {
  closeAllRoleSections();
  
  if (typeof createStatisticsExportContainer === 'function') {
    createStatisticsExportContainer();
    const statisticsContainer = document.getElementById("statistics-export-container");
    statisticsContainer.style.display = "block";
    initializeStatisticsExport();
    
    setTimeout(() => {
      statisticsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  } else {
    console.error('Statistics UI module not loaded yet');
  }
}

function initializeStatisticsExport() {
  const token = JWTManager.getToken();
  if (!token) {
    console.log("User not authenticated - some features may be limited");
  }
  
  setTimeout(() => {
    if (typeof initializeStatisticsTabs === 'function') {
      initializeStatisticsTabs();
    }
    if (typeof initializeStatisticsExports === 'function') {
      initializeStatisticsExports();
    }
    if (typeof loadOverviewStats === 'function') {
      loadOverviewStats();
    }
    if (typeof loadRankings === 'function') {
      loadRankings();
    }
  }, 100);
}

window.initializeStatisticsExport = initializeStatisticsExport;
window.showStatisticsExport = showStatisticsExport;
