export function openReportAlert(reviewId) {
  const description = window.prompt('Please describe the reason for reporting this review:', '');
  if (description === null) return; 

  if (!description.trim()) {
    alert('You must provide a description for the report.');
    return;
  }
  
  fetch('/IRI_LilKartoffel/api/reviews/report', {
    method: 'POST',
    headers: {
      ...window.JWTManager?.getAuthHeaders?.(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ review_id: reviewId, description })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Review reported successfully!');
      } else {
        alert(data.error || 'Failed to report review.');
      }
    })
    .catch(() => alert('Failed to report review.'));
}

window.openReportAlert = openReportAlert;