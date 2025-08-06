<?php
/**
 * UserController handles user authentication, registration, profile management and admin functionalities.
 * It includes methods for login, registration, profile updates, and user management.
 */
class UserController extends BaseController
{
    private ValidationsController $validationsController;

    public function __construct()
    {
        parent::__construct(); 
        $this->validationsController = new ValidationsController();
    }

    // Verify if user is logged in and if he has a valid token
    public function getAuthStatus(): void
    {
        try {
            $headers = getallheaders();
            $authHeader = $headers['Authorization'] ?? '';
            if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
                Response::success(['isAuthenticated' => false]);
                return;
            }

            $token = substr($authHeader, 7);
            if (empty($token)) {
                Response::success(['isAuthenticated' => false]);
                return;
            }

            $isValid = $this->verifyJWTToken($token);
            if ($isValid) {
                $userData = $this->getUserDataFromToken($token);
                Response::success([
                    'isAuthenticated' => true,
                    'user' => $userData
                ]);
            } else {
                Response::success(['isAuthenticated' => false]);
            }
        } catch (Exception $e) {
            Response::success(['isAuthenticated' => false]);
        }
    }

    public function login(): void
    {
        $input = $this->getRequestData();
        if (!$input) {
            Response::error('Invalid request data', 400);
            return;
        }
        $email = '';
        $password = $input['password'] ?? '';

        try {
            $email = $this->validationsController->validateEmail(InputSanitizer::sanitizeEmail($input['email'] ?? ''));
        } catch (Exception $e) {
            Response::error('Email format invalid', 400);
            return;
        }

        if (empty($password)) {
            Response::error('Password is required', 400);
            return;
        }

        $user = $this->userModel->findByEmail($email);
        if (!$user) {
            Response::error('Email not found.', 401);
            return;
        }

        if (!password_verify($password, $user['password'])) {
            Response::error('Wrong password', 401);
            return;
        }

        $token = $this->generateJWTToken($user);
        Response::success([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'role_name' => $user['role_name']
            ],
            'redirect' => '/IRI_LilKartoffel/'
        ]);
    }

    public function register(): void
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                Response::error('Invalid request data', 400);
                return;
            }
            $firstName = $this->validationsController->validateName(InputSanitizer::sanitizeText($input['first_name'] ?? ''), 'First name');
            $lastName = $this->validationsController->validateName(InputSanitizer::sanitizeText($input['last_name'] ?? ''), 'Last name');
            $email = $this->validationsController->validateEmail(InputSanitizer::sanitizeEmail($input['email'] ?? ''));
            $password = $this->validationsController->validatePassword(InputSanitizer::sanitizeText($input['password'] ?? ''));
            $city = $this->validationsController->validateCity(InputSanitizer::sanitizeText($input['city'] ?? ''));

            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $userId = $this->userModel->create([
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'password' => $hashedPassword,
                'city' => $city,
            ]);

            if (!$userId) {
                Response::error('Failed to create user', 500);
                return;
            }

            Response::success([
                'message' => 'User registered successfully',
                'user' => [
                    'id' => $userId,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $email,
                    'city' => $city
                ],
                'redirect' => '/IRI_LilKartoffel/login'
            ]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }

    public function getProfile(): void
    {
        $user = $this->getCurrentAuthenticatedUser();
        if (!$user) {
            Response::error('User not found', 401);
            return;
        }

        $roleController = new RoleController();
        $role = $roleController->getRoleById($user['role_id']);

        $pendingRole = $roleController->getPendingRoleForUser($user['id']);

        Response::success([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'city' => $user['city'],
                'role_id' => $user['role_id'],
                'role_name' => $role ? $role['name'] : 'Unknown',
                'pending_role' => $pendingRole ? $pendingRole : null
            ]
        ]);
    }

    public function updateProfile(): void
    {
        $user = $this->getCurrentAuthenticatedUser();
        if (!$user) {
            Response::error('User not found', 401);
            return;
        }

        $data = $this->getRequestData();
        if (!$data) {
            Response::error('Invalid request data', 400);
            return;
        }

        if (isset($data['role_id']) && $data['role_id'] != $user['role_id']) {
            $roleController = new RoleController();
            $roleModel = new Role();

            $pendingRole = $roleController->getPendingRoleForUser($user['id']);
            if ($pendingRole) {
                Response::error('You already have a pending role change request', 400);
                return;
            }

            $success = $roleModel->createPendingRoleRequest($user['id'], $data['role_id']);
            if (!$success) {
                Response::error('Failed to submit role change request', 500);
                return;
            }

            unset($data['role_id']);
        }

        if (!empty($data)) {
            $updated = $this->userModel->update($user['id'], $data);
            if (!$updated) {
                Response::error('Failed to update profile', 500);
                return;
            }
        }

        Response::success('Profile updated successfully');
    }

    public function requestRoleChange()
    {
        $roleController = new RoleController();
        $roleController->requestRoleChange();
    }

    // Admin functions
    public function getAllUsers(): void
    {
        $adminUser = $this->checkAdminAccess();
        if (!$adminUser) {
            Response::error('Access denied', 403);
            return;
        }

        $users = $this->userModel->getAllUsersWithRoles();
        Response::success(['users' => $users]);
    }

    public function deleteUser(): void
    {
        $adminUser = $this->checkAdminAccess();
        if (!$adminUser) {
            Response::error('Access denied', 403);
            return;
        }

        $data = $this->getRequestData();
        if (!$data) {
            Response::error('Invalid request data', 400);
            return;
        }

        $userId = $data['user_id'] ?? null;
        if (!$userId) {
            Response::error('User ID is required', 400);
            return;
        }

        if ($userId == $adminUser['id']) {
            Response::error('Cannot delete your own account', 400);
            return;
        }

        $result = $this->userModel->deleteById($userId);
        if ($result) {
            Response::success(['message' => 'User deleted successfully']);
        } else {
            Response::error('Failed to delete user', 500);
        }
    }

    // Token verification and user data extraction
    private function verifyJWTToken(string $token): bool
    {
        return JWTHelper::validateToken($token) !== false;
    }

    private function getUserDataFromToken(string $token): ?array
    {
        $userData = JWTHelper::getUserDataFromToken($token);

        if (!$userData) {
            return null;
        }

        return [
            'id' => $userData['user_id'],
            'email' => $userData['email']
        ];
    }

    private function generateJWTToken(array $user): string
    {
        return JWTHelper::generateToken($user['id'], $user['email'], $user['role_name'] ?? null);
    }
}
