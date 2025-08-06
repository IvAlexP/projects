<?php
/**
 * This class provides methods to interact with the users table in the database.
 */
class User
{
    private $db;
    private $table = 'users';

    public function __construct()
    {
        try {
            $this->db = DB::getInstance();
        } catch (Exception $e) {
            error_log("Database connection error: " . $e->getMessage());
            throw $e;
        }
    }

    public function findByEmail($email): ?array
    {
        try {
            $sql = "SELECT u.*, r.name as role_name 
                    FROM {$this->table} u 
                    JOIN roles r ON u.role_id = r.id 
                    WHERE u.email = :email LIMIT 1";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['email' => $email]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ?: null;
        } catch (PDOException $e) {
            error_log("Error finding user by email: " . $e->getMessage());
            return null;
        }
    }

    public function findById($userId): ?array
    {
        try {
            $sql = "SELECT * FROM {$this->table} WHERE id = :id LIMIT 1";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['id' => $userId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ?: null;
        } catch (PDOException $e) {
            error_log("Error finding user by ID: " . $e->getMessage());
            return null;
        }
    }

    public function getCityById($userId)
    {
        try {
            $sql = "SELECT city FROM {$this->table} WHERE id = :id LIMIT 1";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['id' => $userId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ? $result['city'] : null;
        } catch (PDOException $e) {
            error_log("Error getting user city: " . $e->getMessage());
            return null;
        }
    }

    public function create($userData)
    {
        try {            
            $userData['first_name'] = ucfirst(strtolower($userData['first_name']));
            $userData['last_name'] = ucfirst(strtolower($userData['last_name']));
            if (!empty($userData['city'])) {
                $userData['city'] = ucfirst(strtolower($userData['city']));
            }

            $sql = "INSERT INTO {$this->table} (first_name, last_name, email, password, city) 
                    VALUES (:first_name, :last_name, :email, :password, :city)";
            $stmt = $this->db->pdo->prepare($sql);
            if (!$stmt->execute($userData)) {
                $errorInfo = $stmt->errorInfo();
                return false;
            }
            return $this->db->pdo->lastInsertId();
        } catch (PDOException $e) {
            error_log("Error creating user: " . $e->getMessage());
            return false;
        }
    }

    public function update($userId, $userData)
    {
        try {
            $updateFields = [];
            $params = ['id' => $userId];
            if (isset($userData['first_name'])) {
                $updateFields[] = "first_name = :first_name";
                $params['first_name'] = ucfirst(strtolower($userData['first_name']));
            }

            if (isset($userData['last_name'])) {
                $updateFields[] = "last_name = :last_name";
                $params['last_name'] = ucfirst(strtolower($userData['last_name']));
            }
            if (isset($userData['city'])) {
                $updateFields[] = "city = :city";
                $params['city'] = ucfirst(strtolower($userData['city']));
            }

            if (empty($updateFields)) {
                return true;
            }

            $sql = "UPDATE {$this->table} SET " . implode(', ', $updateFields) . " WHERE id = :id";
            $stmt = $this->db->pdo->prepare($sql);

            return $stmt->execute($params);
        } catch (PDOException $e) {
            error_log("Error updating user: " . $e->getMessage());
            return false;
        }
    }

    public function getUserWithRole($userId): ?array
    {
        try {
            $sql = "SELECT u.*, r.name as role_name 
                    FROM {$this->table} u 
                    JOIN roles r ON u.role_id = r.id 
                    WHERE u.id = :user_id LIMIT 1";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['user_id' => $userId]);
            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        } catch (PDOException $e) {
            error_log("Error getting user with role: " . $e->getMessage());
            return null;
        }
    }

    public function getAllUsersWithRoles(): array
    {
        try {
            $sql = "SELECT u.id, u.first_name, u.last_name, u.email, u.city, r.name as role_name 
                    FROM {$this->table} u 
                    JOIN roles r ON u.role_id = r.id 
                    ORDER BY u.last_name, u.first_name";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching all users: " . $e->getMessage());
            return [];
        }
    }

    public function deleteById($userId): bool
    {
        try {
            // Delete review_votes
            $sql = "DELETE FROM review_votes WHERE user_id = :user_id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['user_id' => $userId]);

            // Delete reported_reviews
            $sql = "DELETE FROM reported_reviews WHERE user_id = :user_id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['user_id' => $userId]);

            // Delete reviews
            $reviewModel = new Review();
            $userReviews = $reviewModel->getReviewsByUserId($userId);
            
            foreach ($userReviews as $review) {
                // Delete if is report
                $sql = "DELETE FROM reported_reviews WHERE review_id = :review_id";
                $stmt = $this->db->pdo->prepare($sql);
                $stmt->execute(['review_id' => $review['id']]);
                $reviewModel->deleteReviewAndChildren($review['id']);
            }

            $sql = "DELETE FROM pending_roles WHERE user_id = :user_id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['user_id' => $userId]);


            // 6. Delete entities owned by the user
            $entityModel = new Entity();
            $entities = $entityModel->getByOwnerId($userId);
            foreach ($entities as $entity) {
                $entityModel->delete($entity['id']);
            }

            // 7. Delete user
            $sql = "DELETE FROM {$this->table} WHERE id = :user_id";
            $stmt = $this->db->pdo->prepare($sql);

            return $stmt->execute(['user_id' => $userId]);
        } catch (PDOException $e) {
            error_log("Error deleting user: " . $e->getMessage());
            return false;
        }
    }
    
    public function isAdmin($userId): bool
    {
        try {
            $sql = "SELECT r.name as role_name 
                   FROM {$this->table} u 
                   JOIN roles r ON u.role_id = r.id 
                   WHERE u.id = :user_id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['user_id' => $userId]);
            $userData = $stmt->fetch(PDO::FETCH_ASSOC);

            return $userData && $userData['role_name'] === 'admin';
        } catch (PDOException $e) {
            error_log("Error checking admin status: " . $e->getMessage());
            return false;
        }
    }

    public function isOwner($userId): bool
    {
        try {
            $sql = "SELECT r.name as role_name 
                   FROM {$this->table} u 
                   JOIN roles r ON u.role_id = r.id 
                   WHERE u.id = :user_id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['user_id' => $userId]);
            $userData = $stmt->fetch(PDO::FETCH_ASSOC);

            return $userData && $userData['role_name'] === 'owner';
        } catch (PDOException $e) {
            error_log("Error checking owner status: " . $e->getMessage());
            return false;
        }
    }

    public function isAdminOrOwner($userId): bool
    {
        try {
            $sql = "SELECT r.name as role_name 
                   FROM {$this->table} u 
                   JOIN roles r ON u.role_id = r.id 
                   WHERE u.id = :user_id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['user_id' => $userId]);
            $userData = $stmt->fetch(PDO::FETCH_ASSOC);

            return $userData && ($userData['role_name'] === 'admin' || $userData['role_name'] === 'owner');
        } catch (PDOException $e) {
            error_log("Error checking admin/owner status: " . $e->getMessage());
            return false;
        }
    }

    public function getTotalUsersCount(): int
    {
        try {
            $sql = "SELECT COUNT(*) as count FROM {$this->table}";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute();
            return (int)$stmt->fetch(PDO::FETCH_ASSOC)['count'];
        } catch (PDOException $e) {
            error_log("Error counting total users: " . $e->getMessage());
            return 0;
        }
    }
}
