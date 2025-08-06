document.addEventListener("DOMContentLoaded", async function () {
  const urlParts = window.location.pathname.split("/");
  const id = urlParts[urlParts.length - 1];
  const entitiesManager = new EntitiesManager();

  const categoryName = await entitiesManager.loadCategory(id);
  const entities = await entitiesManager.loadEntities(id);
  const cityFilter = document.getElementById("entities-city-filter");
  if (cityFilter && entities && entities.length > 0) {
    const uniqueCities = [...new Set(entities.filter(e => e.city).map(e => e.city))];
    uniqueCities.sort((a, b) => a.localeCompare(b));
    uniqueCities.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      cityFilter.appendChild(opt);
    });
  }
});
