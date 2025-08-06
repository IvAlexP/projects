<?php
/**
 * This class provides methods to create, read, update and delete categories.
 */
class Category
{
    private $db;
    private $table = 'categories';

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
            $sql = "SELECT * FROM {$this->table} c
                    WHERE EXISTS (
                        SELECT 1 FROM entities e
                        WHERE e.category_id = c.id AND e.status = 'approved'
                    )
                    ORDER BY c.name";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching categories: " . $e->getMessage());
            return [];
        }
    }

    public function getById(int $categoryId): ?array
    {
        try {
            $sql = "SELECT * FROM {$this->table} WHERE id = :id LIMIT 1";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['id' => $categoryId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ?: null;
        } catch (PDOException $e) {
            error_log("Error finding category by ID: " . $e->getMessage());
            return null;
        }
    }

    public function getTraitsByCategoryId(int $categoryId): array
    {
        try {
            $sql = "SELECT * FROM traits WHERE category_id = :category_id ORDER BY name";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['category_id' => $categoryId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error getting traits for category: " . $e->getMessage());
            return [];
        }
    }

    public function create(array $categoryData): int|false
    {
        try {
            $sql = "INSERT INTO {$this->table} (name) VALUES (:name)";
            $stmt = $this->db->pdo->prepare($sql);

            $params = [
                'name' => $categoryData['name']
            ];

            if ($stmt->execute($params)) {
                return $this->db->pdo->lastInsertId();
            }
            return false;
        } catch (PDOException $e) {
            error_log("Error creating category: " . $e->getMessage());
            return false;
        }
    }

    public function update(int $categoryId, array $categoryData): bool
    {
        try {
            $updateFields = [];
            $params = ['id' => $categoryId];

            if (isset($categoryData['name'])) {
                $updateFields[] = "name = :name";
                $params['name'] = $categoryData['name'];
            }

            if (isset($categoryData['description'])) {
                $updateFields[] = "description = :description";
                $params['description'] = $categoryData['description'];
            }

            if (empty($updateFields)) {
                return true;
            }

            $sql = "UPDATE {$this->table} SET " . implode(', ', $updateFields) . " WHERE id = :id";
            $stmt = $this->db->pdo->prepare($sql);
            return $stmt->execute($params);
        } catch (PDOException $e) {
            error_log("Error updating category: " . $e->getMessage());
            return false;
        }
    }

    public function delete(int $categoryId): bool
    {
        try {
            $sql = "DELETE FROM {$this->table} WHERE id = :id";
            $stmt = $this->db->pdo->prepare($sql);
            return $stmt->execute(['id' => $categoryId]);
        } catch (PDOException $e) {
            error_log("Error deleting category: " . $e->getMessage());
            return false;
        }
    }

    // If it is 0, we dont't show the category
    public function getEntitiesCount(int $categoryId): int
    {
        try {
            $sql = "SELECT COUNT(*) as count FROM entities WHERE category_id = :category_id AND status = 'approved'";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['category_id' => $categoryId]);
            return (int)$stmt->fetch(PDO::FETCH_ASSOC)['count'];
        } catch (PDOException $e) {
            error_log("Error counting entities for category: " . $e->getMessage());
            return 0;
        }
    }
}
