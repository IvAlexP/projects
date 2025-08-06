<?php

/**
 * This class provides methods to interact with the entities table in the database.
 */
class Entity
{
    private $db;
    private $table = 'entities';

    public function __construct()
    {
        try {
            $this->db = DB::getInstance();
        } catch (Exception $e) {
            error_log("Database connection error: " . $e->getMessage());
            throw $e;
        }
    }

    public function getByCategory($categoryId)
    {
        try {

            $sql = "
                SELECT e.id, e.name, e.description, e.picture, e.city 
                FROM {$this->table} e 
                WHERE e.category_id = :category_id AND e.status = 'approved'
            ";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['category_id' => $categoryId]);
            $entitiesData = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $entityDtos = [];
            foreach ($entitiesData as $entityData) {
                $entityDto = new EntityDto(
                    $entityData['id'],
                    $entityData['name'],
                    $entityData['description'],
                    $entityData['picture'],
                    $entityData['city']
                );

                $traitsSql = "
                    SELECT id, name 
                    FROM traits 
                    WHERE category_id = :category_id
                    ORDER BY name
                ";
                $traitsStmt = $this->db->pdo->prepare($traitsSql);
                $traitsStmt->execute(['category_id' => $categoryId]);
                $traitsData = $traitsStmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($traitsData as $traitData) {
                    $avgSql = "
                        SELECT AVG(rtr.rating) as average_rating
                        FROM review_trait_rating rtr
                        JOIN reviews r ON rtr.review_id = r.id
                        WHERE rtr.trait_id = :trait_id AND r.entity_id = :entity_id
                    ";
                    $avgStmt = $this->db->pdo->prepare($avgSql);
                    $avgStmt->execute([
                        'trait_id' => $traitData['id'],
                        'entity_id' => $entityData['id']
                    ]);
                    $avgResult = $avgStmt->fetch(PDO::FETCH_ASSOC);

                    $averageRating = $avgResult['average_rating'] ? (float)$avgResult['average_rating'] : 0.0;

                    $traitDto = new TraitDto(
                        $traitData['id'],
                        $traitData['name'],
                        $averageRating
                    );
                    $entityDto->addTrait($traitDto);
                }

                $entityDtos[] = $entityDto;
            }

            return $entityDtos;
        } catch (PDOException $e) {
            error_log("Error fetching entities by category: " . $e->getMessage());
            return false;
        }
    }

    public function getById($id)
    {
        try {
            $sql = "
                SELECT e.id, e.name, e.description, e.picture, e.city, e.category_id, 
                       CONCAT(u.first_name, ' ', u.last_name) as owner_name
                FROM {$this->table} e 
                LEFT JOIN users u ON e.owner_id = u.id
                WHERE e.id = :id AND e.status = 'approved'
            ";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['id' => $id]);
            $entityData = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$entityData) {
                return false;
            }
            $entityDto = new EntityDto(
                $entityData['id'],
                $entityData['name'],
                $entityData['description'],
                $entityData['picture'],
                $entityData['city']
            );

            $entityDto->setCategoryId($entityData['category_id']);
            if (isset($entityData['owner_name'])) {
                $entityDto->owner_name = $entityData['owner_name'];
            }


            $traitsSql = "
                SELECT id, name 
                FROM traits 
                WHERE category_id = :category_id
                ORDER BY name
            ";
            $traitsStmt = $this->db->pdo->prepare($traitsSql);
            $traitsStmt->execute(['category_id' => $entityData['category_id']]);
            $traitsData = $traitsStmt->fetchAll(PDO::FETCH_ASSOC);


            foreach ($traitsData as $traitData) {
                $avgSql = "
                    SELECT AVG(rtr.rating) as average_rating
                    FROM review_trait_rating rtr
                    JOIN reviews r ON rtr.review_id = r.id
                    WHERE rtr.trait_id = :trait_id AND r.entity_id = :entity_id
                ";
                $avgStmt = $this->db->pdo->prepare($avgSql);
                $avgStmt->execute([
                    'trait_id' => $traitData['id'],
                    'entity_id' => $id
                ]);
                $avgResult = $avgStmt->fetch(PDO::FETCH_ASSOC);

                $averageRating = $avgResult['average_rating'] ? (float)$avgResult['average_rating'] : 0.0;

                $traitDto = new TraitDto(
                    $traitData['id'],
                    $traitData['name'],
                    $averageRating
                );
                $entityDto->addTrait($traitDto);
            }

            return $entityDto;
        } catch (PDOException $e) {
            error_log("Error fetching entity by ID: " . $e->getMessage());
            return false;
        }
    }

    public function getRawById($id)
    {
        try {
            $sql = "
                SELECT e.id, e.name, e.description, e.picture, e.city, e.category_id, e.owner_id 
                FROM {$this->table} e 
                WHERE e.id = :id
            ";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['id' => $id]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching raw entity by ID: " . $e->getMessage());
            return false;
        }
    }

    public function getByOwnerId($ownerId)
    {
        try {
            $sql = "SELECT e.id, e.name, e.description, e.picture, e.city, e.category_id, e.status, c.name as category_name 
                    FROM {$this->table} e 
                    LEFT JOIN categories c ON e.category_id = c.id 
                    WHERE e.owner_id = :owner_id 
                    ORDER BY e.id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['owner_id' => $ownerId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching entities by owner ID: " . $e->getMessage());
            return false;
        }
    }

    public function update($id, $data)
    {
        try {
            $fields = [];
            $values = [];
            foreach ($data as $key => $value) {
                if (in_array($key, ['name', 'description', 'picture', 'city'])) {
                    $fields[] = "{$key} = :{$key}";
                    $values[$key] = $value;
                }
            }

            if (empty($fields)) {
                return false;
            }

            $values['id'] = $id;
            $sql = "UPDATE {$this->table} SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $this->db->pdo->prepare($sql);
            return $stmt->execute($values);
        } catch (PDOException $e) {
            error_log("Error updating entity: " . $e->getMessage());
            return false;
        }
    }

    public function create($data, $ownerId)
    {
        try {
            $sql = "INSERT INTO {$this->table} (name, description, picture, city, owner_id, category_id, status) VALUES (:name, :description, :picture, :city, :owner_id, :category_id, :status)";
            $stmt = $this->db->pdo->prepare($sql);

            $values = [
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'picture' => $data['picture'] ?? null,
                'city' => $data['city'],
                'owner_id' => $ownerId,
                'category_id' => $data['category_id'] ?? null,
                'status' => 'pending'
            ];

            if ($stmt->execute($values)) {
                return $this->db->pdo->lastInsertId();
            }

            return false;
        } catch (PDOException $e) {
            error_log("Error creating entity: " . $e->getMessage());
            return false;
        }
    }

    public function delete($id, $ownerId = null)
    {
        try {
            if ($ownerId !== null) {
                $sql = "DELETE FROM {$this->table} WHERE id = :id AND owner_id = :owner_id";
                $stmt = $this->db->pdo->prepare($sql);
                return $stmt->execute(['id' => $id, 'owner_id' => $ownerId]);
            } else {
                $sql = "DELETE FROM {$this->table} WHERE id = :id";
                $stmt = $this->db->pdo->prepare($sql);
                return $stmt->execute(['id' => $id]);
            }
        } catch (PDOException $e) {
            error_log("Error deleting entity: " . $e->getMessage());
            return false;
        }
    }

    public function getNearbyEntities($userCity)
    {
        try {
            if (empty($userCity)) {
                return [];
            }

            $sql = "
                SELECT DISTINCT e.id, e.name, e.description, e.picture, e.city,
                       c.name as category_name, c.id as category_id
                FROM {$this->table} e 
                JOIN categories c ON e.category_id = c.id
                WHERE e.city = :city AND e.status = 'approved'
                ORDER BY e.name
            ";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->bindValue(':city', $userCity, PDO::PARAM_STR);
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching nearby entities: " . $e->getMessage());
            return [];
        }
    }

    public function getPendingEntities(): array
    {
        try {
            $sql = "
                SELECT 
                    e.id,
                    e.name,
                    e.description,
                    e.picture,
                    e.city,
                    e.status,
                    c.name as category_name,
                    CONCAT(u.first_name, ' ', u.last_name) as owner_name,
                    u.email as owner_email
                FROM {$this->table} e
                LEFT JOIN categories c ON e.category_id = c.id
                LEFT JOIN users u ON e.owner_id = u.id
                WHERE e.status = 'pending'
                ORDER BY e.id DESC
            ";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching pending entities: " . $e->getMessage());
            return [];
        }
    }

    public function updateStatus(int $entityId, string $status): bool
    {
        try {
            $allowedStatuses = ['pending', 'approved', 'rejected'];
            if (!in_array($status, $allowedStatuses)) {
                return false;
            }

            $sql = "UPDATE {$this->table} SET status = :status WHERE id = :id";
            $stmt = $this->db->pdo->prepare($sql);
            return $stmt->execute([
                'status' => $status,
                'id' => $entityId
            ]);
        } catch (PDOException $e) {
            error_log("Error updating entity status: " . $e->getMessage());
            return false;
        }
    }

    public function getApprovedEntitiesCount(): int
    {
        try {
            $sql = "SELECT COUNT(*) as count FROM {$this->table} WHERE status = 'approved'";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute();
            return (int)$stmt->fetch(PDO::FETCH_ASSOC)['count'];
        } catch (PDOException $e) {
            error_log("Error counting approved entities: " . $e->getMessage());
            return 0;
        }
    }

    public function getCitiesWithEntitiesCount(): array
    {
        try {
            $sql = "
                SELECT city, COUNT(*) as entity_count 
                FROM {$this->table} 
                WHERE city IS NOT NULL AND city != '' AND status = 'approved'
                GROUP BY city 
                ORDER BY entity_count DESC, city ASC
            ";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching cities with entities count: " . $e->getMessage());
            return [];
        }
    }

    public function getUniqueCitiesCount(): int
    {
        try {
            $sql = "SELECT COUNT(DISTINCT city) as count FROM {$this->table} WHERE city IS NOT NULL AND city != '' AND status = 'approved'";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute();
            return (int)$stmt->fetch(PDO::FETCH_ASSOC)['count'];
        } catch (PDOException $e) {
            error_log("Error counting unique cities: " . $e->getMessage());
            return 0;
        }
    }

    public function getEntityRankings(string $order = 'DESC', ?string $city = null): array
    {
        try {
            $whereClause = "WHERE e.status = 'approved'";
            $params = [];

            if ($city) {
                $whereClause = "WHERE e.city = :city AND e.status = 'approved'";
                $params['city'] = $city;
            }

            $sql = "
                SELECT 
                    e.id,
                    e.name,
                    e.city,
                    c.name as category_name,
                    AVG(rtr.rating) as average_rating,
                    COUNT(DISTINCT r.id) as review_count
                FROM {$this->table} e
                LEFT JOIN reviews r ON e.id = r.entity_id AND r.parent_id IS NULL
                LEFT JOIN review_trait_rating rtr ON r.id = rtr.review_id
                LEFT JOIN categories c ON e.category_id = c.id
                {$whereClause}
                GROUP BY e.id, e.name, e.city, c.name
                HAVING review_count > 0 AND average_rating IS NOT NULL
                ORDER BY average_rating {$order}, review_count DESC
                LIMIT 20
            ";

            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching entity rankings: " . $e->getMessage());
            return [];
        }
    }
    
    public function getExportStats(): array
    {
        try {
            $sql = "
                SELECT 
                    e.id,
                    e.name as entity_name,
                    e.city,
                    e.description,
                    c.name as category_name,
                    COUNT(DISTINCT r.id) as total_reviews,
                    AVG(rtr.rating) as average_rating,
                    MAX(r.created_at) as last_review_date
                FROM {$this->table} e
                LEFT JOIN reviews r ON e.id = r.entity_id AND r.parent_id IS NULL
                LEFT JOIN review_trait_rating rtr ON r.id = rtr.review_id
                LEFT JOIN categories c ON e.category_id = c.id
                WHERE e.status = 'approved'
                GROUP BY e.id, e.name, e.city, e.description, c.name
                ORDER BY e.name
            ";

            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error getting export stats: " . $e->getMessage());
            return [];
        }
    }
}
