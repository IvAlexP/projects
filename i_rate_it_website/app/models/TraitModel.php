<?php
/**
 * This class provides methods to interact with the traits table in the database.
 * (TraitModel not Trait because Trait is a reserved keyword in PHP)
 */
class TraitModel
{
    private $db;
    private $table = 'traits';

    public function __construct()
    {
        try {
            $this->db = DB::getInstance();
        } catch (Exception $e) {
            error_log("Database connection error: " . $e->getMessage());
            throw $e;
        }
    }

    public function getByCategoryId(int $categoryId): array
    {
        try {
            $sql = "SELECT * FROM {$this->table} WHERE category_id = :category_id ORDER BY name";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['category_id' => $categoryId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error getting traits for category: " . $e->getMessage());
            return [];
        }
    }

    public function getById(int $traitId): ?array
    {
        try {
            $sql = "SELECT * FROM {$this->table} WHERE id = :id LIMIT 1";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['id' => $traitId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ?: null;
        } catch (PDOException $e) {
            error_log("Error finding trait by ID: " . $e->getMessage());
            return null;
        }
    }

    public function getAll(): array
    {
        try {
            $sql = "SELECT t.*, c.name as category_name 
                    FROM {$this->table} t 
                    LEFT JOIN categories c ON t.category_id = c.id 
                    ORDER BY c.name, t.name";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching all traits: " . $e->getMessage());
            return [];
        }
    }

    public function create(array $traitData): int|false
    {
        try {
            $sql = "INSERT INTO {$this->table} (name, category_id) 
                    VALUES (:name, :category_id)";
            $stmt = $this->db->pdo->prepare($sql);

            $params = [
                'name' => $traitData['name'],
                'category_id' => $traitData['category_id']
            ];

            if ($stmt->execute($params)) {
                return $this->db->pdo->lastInsertId();
            }
            return false;
        } catch (PDOException $e) {
            error_log("Error creating trait: " . $e->getMessage());
            return false;
        }
    }

    public function delete(int $traitId): bool
    {
        try {
            $sql = "DELETE FROM {$this->table} WHERE id = :id";
            $stmt = $this->db->pdo->prepare($sql);
            return $stmt->execute(['id' => $traitId]);
        } catch (PDOException $e) {
            error_log("Error deleting trait: " . $e->getMessage());
            return false;
        }
    }

    public function getAverageRatingForEntity(int $traitId, int $entityId): float
    {
        try {
            $sql = "
                SELECT AVG(rtr.rating) as average_rating
                FROM review_trait_rating rtr
                JOIN reviews r ON rtr.review_id = r.id
                WHERE rtr.trait_id = :trait_id AND r.entity_id = :entity_id
            ";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute([
                'trait_id' => $traitId,
                'entity_id' => $entityId
            ]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['average_rating'] ? (float)$result['average_rating'] : 0.0;
        } catch (PDOException $e) {
            error_log("Error getting average rating for trait: " . $e->getMessage());
            return 0.0;
        }
    }
}
