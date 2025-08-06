function showAdminReportsPanel() {
  closeAllRoleSections();
  let container = document.getElementById('admin-reports-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'admin-reports-container';
    container.className = 'pending-roles-container'; 
    document.body.appendChild(container);
  }
  container.style.display = 'block';
  container.innerHTML = '';

  
  const containerHeader = document.createElement('div');
  containerHeader.className = 'pending-roles-header';
  const headerTitle = document.createElement('h3');
  headerTitle.textContent = 'Review Reports';
  const closeButton = document.createElement('button');
  closeButton.id = 'close-admin-reports';
  closeButton.className = 'close';
  closeButton.textContent = 'X';
  closeButton.onclick = () => {
    container.style.display = 'none';
  };
  containerHeader.appendChild(headerTitle);
  containerHeader.appendChild(closeButton);

  const listDiv = document.createElement('div');
  listDiv.id = 'admin-reports-list';
  listDiv.className = 'pending-roles-list';
  listDiv.textContent = 'Loading...';

  container.appendChild(containerHeader);
  container.appendChild(listDiv);

  loadAdminReports();

  setTimeout(() => {
    container.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

function loadAdminReports() {
  fetch('/IRI_LilKartoffel/api/reviews/reports', {
    headers: window.JWTManager?.getAuthHeaders?.() || {}
  })
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('admin-reports-list');
      if (!data.success || !data.reports || !data.reports.length) {
        list.innerHTML = '<div>No reports found.</div>';
        return;
      }
      list.innerHTML = '';
      data.reports.forEach(report => {
        const item = document.createElement('div');
        item.className = 'pending-role-item';
        item.style.border = '';
        item.style.borderRadius = '';
        item.style.margin = '';
        item.style.padding = '';

        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        const userName = document.createElement('div');
        userName.className = 'user-name';
        userName.textContent = 'User: ' + (report.user || '-');
        const userEmail = document.createElement('div');
        userEmail.className = 'user-email';
        const userEmailLabel = document.createElement('b');
        userEmailLabel.textContent = 'Entity:';
        userEmail.textContent = ' ' + (report.entity_name || '-');
        userEmail.prepend(userEmailLabel);
        userInfo.appendChild(userName);
        userInfo.appendChild(userEmail);

        const roleInfo = document.createElement('div');
        roleInfo.className = 'role-info';
        const currentRole = document.createElement('div');
        currentRole.className = 'current-role';
        currentRole.textContent = 'Review: ' + (report.review || '-');
        const desiredRole = document.createElement('div');
        desiredRole.className = 'desired-role';
        const desiredRoleLabel = document.createElement('b');
        desiredRoleLabel.textContent = 'Report description:';
        desiredRole.textContent = ' ' + (report.description || '-');
        desiredRole.prepend(desiredRoleLabel);
        roleInfo.appendChild(currentRole);
        roleInfo.appendChild(desiredRole);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'pending-roles-actions';
        actionsDiv.style.marginTop = '8px';
        actionsDiv.style.display = 'flex';
        actionsDiv.style.gap = '8px';
        const approveBtn = document.createElement('button');
        approveBtn.className = 'button-full admin-report-approve';
        approveBtn.dataset.id = report.id;
        approveBtn.textContent = 'Approve';
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'button-border admin-report-cancel';
        cancelBtn.dataset.id = report.id;
        cancelBtn.textContent = 'Cancel';
        actionsDiv.appendChild(approveBtn);
        actionsDiv.appendChild(cancelBtn);

        item.appendChild(userInfo);
        item.appendChild(roleInfo);
        item.appendChild(actionsDiv);

        list.appendChild(item);
      });
      attachAdminReportActions();
    })
    .catch(() => {
      document.getElementById('admin-reports-list').innerHTML = '<div style="color:red">Failed to load reports.</div>';
    });
}

function attachAdminReportActions() {
  document.querySelectorAll('.admin-report-approve').forEach(btn => {
    btn.onclick = function() {
      if (!confirm('Approve this report? The review and all its replies will be deleted.')) return;
      processAdminReportAction(this.dataset.id, true);
    };
  });
  document.querySelectorAll('.admin-report-cancel').forEach(btn => {
    btn.onclick = function() {
      if (!confirm('Cancel this report?')) return;
      processAdminReportAction(this.dataset.id, false);
    };
  });
}

function processAdminReportAction(reportId, approved) {
  fetch(`/IRI_LilKartoffel/api/reviews/${approved ? 'report-approve' : 'report-cancel'}`,
    {
      method: 'POST',
      headers: {
        ...window.JWTManager?.getAuthHeaders?.(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ report_id: reportId })
    }
  )
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert(approved ? 'Report approved and review deleted.' : 'Report cancelled.');
        loadAdminReports();
      } else {
        alert(data.error || 'Action failed.');
      }
    })
    .catch(() => alert('Action failed.'));
}

window.showAdminReportsPanel = showAdminReportsPanel;
