<?php
/**
 * BaseController (Every controller should extend this class)
 * This class provides common functionality for all controllers.
 */
abstract class BaseController
{
    protected User $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    protected function getCurrentAuthenticatedUser(): ?array
    {
        $token = JWTHelper::getTokenFromHeaders();
        if (!$token || !JWTHelper::validateToken($token)) {
            return null;
        }

        $userData = JWTHelper::getUserDataFromToken($token);
        if (!$userData) {
            return null;
        }

        return $this->userModel->findByEmail($userData['email']);
    }

    protected function requireAuthentication(): ?array
    {
        $user = $this->getCurrentAuthenticatedUser();
        if (!$user) {
            Response::error('Authentication required', 401);
            return null;
        }
        return $user;
    }

    protected function checkAdminAccess(): ?array
    {
        $user = $this->getCurrentAuthenticatedUser();
        if (!$user) {
            return null;
        }

        $isAdminOrOwner = $this->userModel->isAdminOrOwner($user['id']);
        return $isAdminOrOwner ? $user : null;
    }

    protected function requireAdminAccess(): ?array
    {
        $adminUser = $this->checkAdminAccess();
        if (!$adminUser) {
            Response::error('Access denied', 403);
            return null;
        }
        return $adminUser;
    }

    protected function requireOwnerAccess(): ?array
    {
        $user = $this->getCurrentAuthenticatedUser();
        if (!$user) {
            Response::error('Authentication required', 401);
            return null;
        }

        $isOwner = $this->userModel->isOwner($user['id']);
        if (!$isOwner) {
            Response::error('Owner access required', 403);
            return null;
        }

        return $user;
    }

    protected function getRequestData(): ?array
    {
        $json = file_get_contents('php://input');
        if (empty($json)) {
            return null;
        }

        $data = json_decode($json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return null;
        }

        return $data;
    }
}
