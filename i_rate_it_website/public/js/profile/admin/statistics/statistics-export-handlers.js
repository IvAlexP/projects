async function exportData(type, format) {
  try {
    const url = `/IRI_LilKartoffel/api/export/${format}?type=${type}`;
    console.log("Exporting:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Export failed: ${response.status} ${response.statusText}`);
    }

    if (format === 'csv') {
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${type}_export.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } else if (format === 'pdf') {
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${type}_export.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    }

    console.log(`${format.toUpperCase()} export completed successfully`);
  } catch (error) {
    console.error("Export error:", error);
    alert(`Export failed: ${error.message}`);
  }
}

function handleRSSExport() {
  const rssUrl = "/IRI_LilKartoffel/api/export/rss";
  window.open(rssUrl, "_blank");
}

function copyRSSLink() {
  const rssUrl = window.location.origin + "/IRI_LilKartoffel/api/export/rss";
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(rssUrl).then(() => {
      alert("RSS link copied to clipboard!");
    }).catch(() => {
      fallbackCopyToClipboard(rssUrl);
    });
  } else {
    fallbackCopyToClipboard(rssUrl);
  }
}

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    alert("RSS link copied to clipboard!");
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
    alert("Copy failed. RSS URL: " + text);
  }
  
  document.body.removeChild(textArea);
}

window.exportData = exportData;
window.handleRSSExport = handleRSSExport;
window.copyRSSLink = copyRSSLink;
