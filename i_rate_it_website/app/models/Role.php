<?php
/**
 * This class provides methods to retrieve roles, create pending role requests and process those requests.
 */
class Role
{
    private $db;
    private $table = 'roles';
    private $pendingTable = 'pending_roles';

    public function __construct()
    {
        try {
            $this->db = DB::getInstance();
        } catch (Exception $e) {
            error_log("Database connection error: " . $e->getMessage());
            throw $e;
        }
    }

    public function getAll(): array
    {
        try {
            $sql = "SELECT id, name FROM {$this->table} ORDER BY name";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching roles: " . $e->getMessage());
            return [];
        }
    }

    public function getById(int $roleId): ?array
    {
        try {
            $sql = "SELECT id, name FROM {$this->table} WHERE id = :id LIMIT 1";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['id' => $roleId]);
            $role = $stmt->fetch(PDO::FETCH_ASSOC);
            return $role ?: null;
        } catch (PDOException $e) {
            error_log("Error fetching role by ID: " . $e->getMessage());
            return null;
        }
    }

    public function createPendingRoleRequest(int $userId, int $roleId): bool
    {
        try {
            $checkSql = "SELECT COUNT(*) FROM {$this->pendingTable} WHERE user_id = :user_id";
            $checkStmt = $this->db->pdo->prepare($checkSql);
            $checkStmt->execute(['user_id' => $userId]);
            $pendingCount = $checkStmt->fetchColumn();

            if ($pendingCount > 0) {
                return false; 
            }

            $insertSql = "INSERT INTO {$this->pendingTable} (user_id, role_id) VALUES (:user_id, :role_id)";
            $insertStmt = $this->db->pdo->prepare($insertSql);
            return $insertStmt->execute([
                'user_id' => $userId,
                'role_id' => $roleId
            ]);
        } catch (PDOException $e) {
            error_log("Error creating pending role request: " . $e->getMessage());
            return false;
        }
    }

    public function getPendingRoleForUser(int $userId): ?array
    {
        try {
            $sql = "SELECT pr.role_id, r.name as role_name 
                    FROM {$this->pendingTable} pr 
                    JOIN {$this->table} r ON pr.role_id = r.id 
                    WHERE pr.user_id = :user_id 
                    LIMIT 1";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['user_id' => $userId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ?: null;
        } catch (PDOException $e) {
            error_log("Error fetching pending role: " . $e->getMessage());
            return null;
        }
    }

    public function getAllPendingRoles(): array
    {
        try {
            $sql = "SELECT 
                    pr.user_id, 
                    pr.role_id as desired_role_id,
                    u.first_name, 
                    u.last_name, 
                    u.email,
                    cr.id as current_role_id,
                    cr.name as current_role_name,
                    dr.name as desired_role_name
                    FROM {$this->pendingTable} pr
                    JOIN users u ON pr.user_id = u.id
                    JOIN {$this->table} cr ON u.role_id = cr.id
                    JOIN {$this->table} dr ON pr.role_id = dr.id
                    ORDER BY pr.created_at DESC";

            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching pending roles: " . $e->getMessage());
            return [];
        }
    }

    public function getPendingRoleRequest(int $userId): ?array
    {
        try {
            $sql = "SELECT pr.user_id, pr.role_id 
                    FROM {$this->pendingTable} pr 
                    WHERE pr.user_id = :user_id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['user_id' => $userId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ?: null;
        } catch (PDOException $e) {
            error_log("Error fetching pending role request: " . $e->getMessage());
            return null;
        }
    }

    public function processRoleRequest(int $userId, string $action): bool
    {
        try {
            $request = $this->getPendingRoleRequest($userId);
            if (!$request) {
                return false; 
            }

            $this->db->pdo->beginTransaction();

            if ($action === 'approve') {
                $updateSql = "UPDATE users SET role_id = :role_id WHERE id = :user_id";
                $updateStmt = $this->db->pdo->prepare($updateSql);
                $updateResult = $updateStmt->execute([
                    'role_id' => $request['role_id'],
                    'user_id' => $request['user_id']
                ]);

                if (!$updateResult) {
                    $this->db->pdo->rollBack();
                    return false;
                }
            }

            $deleteSql = "DELETE FROM {$this->pendingTable} WHERE user_id = :user_id";
            $deleteStmt = $this->db->pdo->prepare($deleteSql);
            $deleteResult = $deleteStmt->execute([
                'user_id' => $request['user_id']
            ]);

            if (!$deleteResult) {
                $this->db->pdo->rollBack();
                return false;
            }

            $this->db->pdo->commit();
            return true;
        } catch (PDOException $e) {
            if ($this->db->pdo->inTransaction()) {
                $this->db->pdo->rollBack();
            }
            error_log("Error processing role request: " . $e->getMessage());
            return false;
        }
    }

    public function hasPendingRequest(int $userId): bool
    {
        try {
            $sql = "SELECT COUNT(*) FROM {$this->pendingTable} WHERE user_id = :user_id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['user_id' => $userId]);
            return $stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            error_log("Error checking pending request: " . $e->getMessage());
            return false;
        }
    }
}
