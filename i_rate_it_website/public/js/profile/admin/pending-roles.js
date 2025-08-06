function showPendingRoles() {
  closeAllRoleSections();
  
  createPendingRolesContainer();
  const pendingRolesContainer = document.getElementById("pending-roles-container");
  pendingRolesContainer.style.display = "block";
  loadPendingRoles();
  
  setTimeout(() => {
    pendingRolesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function loadPendingRoles() {
  const pendingRolesList = document.getElementById("pending-roles-list");
  while (pendingRolesList.firstChild) {
    pendingRolesList.removeChild(pendingRolesList.firstChild);
  }
  
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading';
  loadingDiv.textContent = 'Loading pending role requests...';
  pendingRolesList.appendChild(loadingDiv);
  
  fetch("/IRI_LilKartoffel/api/pending-roles", {
    headers: JWTManager.getAuthHeaders()
  })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.pendingRoles) {
        displayPendingRoles(data.pendingRoles);
      } else {
        while (pendingRolesList.firstChild) {
          pendingRolesList.removeChild(pendingRolesList.firstChild);
        }
        const noPendingDiv = document.createElement('div');
        noPendingDiv.className = 'no-pending-roles';
        noPendingDiv.textContent = 'No pending role requests found.';
        pendingRolesList.appendChild(noPendingDiv);
      }
    })
    .catch(err => {
      console.error("Error loading pending roles:", err);
      while (pendingRolesList.firstChild) {
        pendingRolesList.removeChild(pendingRolesList.firstChild);
      }
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error';
      errorDiv.textContent = 'Failed to load pending role requests. Please try again.';
      pendingRolesList.appendChild(errorDiv);
    });
}

function displayPendingRoles(pendingRoles) {
  const pendingRolesList = document.getElementById("pending-roles-list");
  
  if (pendingRoles.length === 0) {
    while (pendingRolesList.firstChild) {
      pendingRolesList.removeChild(pendingRolesList.firstChild);
    }
    const noPendingDiv = document.createElement('div');
    noPendingDiv.className = 'no-pending-roles';
    noPendingDiv.textContent = 'No pending role requests found.';
    pendingRolesList.appendChild(noPendingDiv);
    return;
  }
  
  while (pendingRolesList.firstChild) {
    pendingRolesList.removeChild(pendingRolesList.firstChild);
  }
  
  pendingRoles.forEach(request => {
    const roleItem = createPendingRoleItem(request);
    pendingRolesList.appendChild(roleItem);
  });
  
  attachRoleActionListeners();
}

function createPendingRoleItem(request) {
  const roleItem = document.createElement('div');
  roleItem.className = 'pending-role-item';
  roleItem.dataset.requestId = request.user_id;
  
  const userInfo = document.createElement('div');
  userInfo.className = 'user-info';
  
  const userName = document.createElement('div');
  userName.className = 'user-name';
  userName.textContent = `${request.last_name} ${request.first_name}`;
  
  const userEmail = document.createElement('div');
  userEmail.className = 'user-email';
  userEmail.textContent = request.email;
  
  userInfo.appendChild(userName);
  userInfo.appendChild(userEmail);
  
  const roleInfo = document.createElement('div');
  roleInfo.className = 'role-info';
  
  const currentRole = document.createElement('div');
  currentRole.className = 'current-role';
  currentRole.textContent = `Current: ${request.current_role_name}`;
  
  const desiredRole = document.createElement('div');
  desiredRole.className = 'desired-role';
  desiredRole.textContent = `Requested: ${request.desired_role_name}`;
  
  roleInfo.appendChild(currentRole);
  roleInfo.appendChild(desiredRole);
  
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'pending-roles-actions';
  
  const approveBtn = document.createElement('button');
  approveBtn.className = 'button-full';
  approveBtn.dataset.requestId = request.user_id;
  approveBtn.textContent = 'Approve';
  
  const rejectBtn = document.createElement('button');
  rejectBtn.className = 'button-border';
  rejectBtn.dataset.requestId = request.user_id;
  rejectBtn.textContent = 'Reject';
  
  actionsDiv.appendChild(approveBtn);
  actionsDiv.appendChild(rejectBtn);
  
  roleItem.appendChild(userInfo);
  roleItem.appendChild(roleInfo);
  roleItem.appendChild(actionsDiv);
  
  return roleItem;
}

function attachRoleActionListeners() {
  document.querySelectorAll('.pending-roles-actions .button-full').forEach(button => {
    button.addEventListener('click', function() {
      handleRoleAction(this.dataset.requestId, 'approve');
    });
  });
  
  document.querySelectorAll('.pending-roles-actions .button-border').forEach(button => {
    button.addEventListener('click', function() {
      handleRoleAction(this.dataset.requestId, 'reject');
    });
  });
}

function handleRoleAction(requestId, action) {  if (!requestId || !action) {
    console.error("Missing request ID or action");
    return;
  }
  const actionText = action === 'approve' ? 'approve' : 'reject';
  if (!confirm(`Are you sure you want to ${actionText} this role change request?`)) {
    return;
  }
  
  processRoleAction(requestId, action);
}

function processRoleAction(requestId, action) {
  fetch("/IRI_LilKartoffel/api/process-role-request", {
    method: "POST",
    headers: {
      ...JWTManager.getAuthHeaders(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      request_id: requestId,
      action: action
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const msg = document.createElement("div");
        msg.className = "success-message";
        msg.textContent = data.message || `Role request ${action}ed successfully!`;
        
        const container = document.getElementById("pending-roles-container");
        const header = container.querySelector(".pending-roles-header");
        container.insertBefore(msg, header.nextSibling);
        
        setTimeout(() => msg.remove(), 3000);
        
        loadPendingRoles();
      } else {
        alert(`Failed to ${action} role request: ${data.error || "Unknown error"}`);
      }
    })
    .catch(err => {
      console.error(`Error processing role request: ${err}`);
      alert(`An error occurred. Please try again.`);    });
}
window.showPendingRoles = showPendingRoles;
window.loadPendingRoles = loadPendingRoles;
