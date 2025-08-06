<?php
/** 
 * Handles role management functionalities including fetching roles, requesting role changes and processing role requests.
 */
class RoleController extends BaseController
{
    private Role $roleModel;

    public function __construct()
    {
        parent::__construct();
        $this->roleModel = new Role();
    }

    public function getAllRoles()
    {
        try {
            $roles = $this->roleModel->getAll();
            Response::success(['roles' => $roles]);
        } catch (Exception $e) {
            error_log("Error fetching roles: " . $e->getMessage());
            Response::error('Failed to load roles', 500);
        }
    }

    public function getRoleById($roleId)
    {
        try {
            $role = $this->roleModel->getById($roleId);
            return $role;
        } catch (Exception $e) {
            error_log("Error fetching role by ID: " . $e->getMessage());
            return null;
        }
    }

    public function requestRoleChange()
    {
        $user = $this->requireAuthentication();
        if (!$user) {
            return;
        }

        $data = $this->getRequestData();
        $roleId = $data['role_id'] ?? null;

        if (!$roleId) {
            Response::error('Role ID is required', 400);
            return;
        }

        try {
            // Check if user already has a pending request
            if ($this->roleModel->hasPendingRequest($user['id'])) {
                Response::error('You already have a pending role change request', 400);
                return;
            }

            $result = $this->roleModel->createPendingRoleRequest($user['id'], $roleId);

            if ($result) {
                Response::success('Role change request submitted successfully');
            } else {
                Response::error('Failed to submit role change request', 500);
            }
        } catch (Exception $e) {
            error_log("Error requesting role change: " . $e->getMessage());
            Response::error('Database error occurred', 500);
        }
    }

    public function getPendingRoleForUser($userId)
    {
        try {
            return $this->roleModel->getPendingRoleForUser($userId);
        } catch (Exception $e) {
            error_log("Error fetching pending role: " . $e->getMessage());
            return null;
        }
    }

    public function getAllPendingRoles()
    {
        $adminUser = $this->requireAdminAccess();
        if (!$adminUser) {
            return; 
        }

        try {
            $pendingRoles = $this->roleModel->getAllPendingRoles();
            Response::success(['pendingRoles' => $pendingRoles]);
        } catch (Exception $e) {
            error_log("Error fetching pending roles: " . $e->getMessage());
            Response::error('Failed to load pending role requests', 500);
        }
    }

    public function processRoleRequest()
    {
        $adminUser = $this->requireAdminAccess();
        if (!$adminUser) {
            return; 
        }

        $data = $this->getRequestData();
        $requestId = $data['request_id'] ?? null;
        $action = $data['action'] ?? null;

        if (!$requestId || !$action || !in_array($action, ['approve', 'reject'])) {
            Response::error('Invalid request parameters', 400);
            return;
        }

        try {
            $result = $this->roleModel->processRoleRequest($requestId, $action);

            if ($result) {
                $message = $action === 'approve' ? 'Role request approved successfully' : 'Role request rejected successfully';
                Response::success(['message' => $message]);
            } else {
                Response::error('Role request not found or failed to process', 404);
            }
        } catch (Exception $e) {
            error_log("Error processing role request: " . $e->getMessage());
            Response::error('Database error occurred', 500);
        }
    }
}
