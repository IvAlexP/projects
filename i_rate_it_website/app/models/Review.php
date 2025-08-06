<?php
/**
 * This class provides methods to create, retrieve, and manage reviews and their associated data.
 */
class Review
{
    private $db;
    private $table = 'reviews';

    public function __construct()
    {
        try {
            $this->db = DB::getInstance();
        } catch (Exception $e) {
            error_log("Database connection error: " . $e->getMessage());
            throw $e;
        }
    }

    public function getByEntityId($entityId)
    {
        try {

            $sql = "SELECT r.id, r.parent_id, r.description, r.created_at,
                           CONCAT(u.first_name, ' ', u.last_name) as user_name 
                    FROM {$this->table} r 
                    JOIN users u ON r.user_id = u.id 
                    WHERE r.entity_id = :entity_id 
                    ORDER BY r.created_at DESC";

            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['entity_id' => $entityId]);
            $allReviews = $stmt->fetchAll(PDO::FETCH_ASSOC);


            foreach ($allReviews as &$review) {
                $review['traits'] = $this->getTraitRatingsByReviewId($review['id']);
                $review['pictures'] = $this->getPicturesByReviewId($review['id']);
                $review['votes'] = $this->getVotesByReviewId($review['id']);


                if ($review['parent_id'] === null && !empty($review['traits'])) {
                    $totalRating = 0;
                    foreach ($review['traits'] as $trait) {
                        $totalRating += $trait['rating'];
                    }
                    $review['rating'] = round($totalRating / count($review['traits']));
                } else {
                    $review['rating'] = $review['parent_id'] === null ? 0 : null;
                }
            }


            $mainReviews = [];
            $reviewsById = [];


            foreach ($allReviews as $review) {
                $reviewsById[$review['id']] = $review;
            }


            foreach ($allReviews as $review) {
                if ($review['parent_id'] === null) {
                    $review['replies'] = $this->getNestedReplies($review['id'], $reviewsById);
                    $mainReviews[] = $review;
                }
            }

            return $mainReviews;
        } catch (PDOException $e) {
            error_log("Error fetching reviews by entity ID: " . $e->getMessage());
            return false;
        }
    }

    private function getNestedReplies($parentId, $allReviews)
    {
        $replies = [];
        foreach ($allReviews as $review) {
            if ($review['parent_id'] == $parentId) {
                $review['replies'] = $this->getNestedReplies($review['id'], $allReviews);
                $replies[] = $review;
            }
        }
        return $replies;
    }

    private function getPicturesByReviewId($reviewId)
    {
        try {
            $sql = "SELECT id, path FROM review_pictures WHERE review_id = :review_id ORDER BY id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['review_id' => $reviewId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching pictures for review ID: " . $e->getMessage());
            return [];
        }
    }

    private function getTraitRatingsByReviewId($reviewId)
    {
        try {
            $sql = "SELECT t.id, t.name, rtr.rating 
                    FROM review_trait_rating rtr
                    JOIN traits t ON rtr.trait_id = t.id
                    WHERE rtr.review_id = :review_id
                    ORDER BY t.name";

            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['review_id' => $reviewId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching trait ratings for review ID: " . $e->getMessage());
            return [];
        }
    }

    public function create($reviewData, $traitRatings = [], $pictures = [])
    {
        try {

            $this->db->pdo->beginTransaction();


            $sql = "INSERT INTO {$this->table} (user_id, entity_id, parent_id, description) 
                    VALUES (:user_id, :entity_id, :parent_id, :description)";
            $stmt = $this->db->pdo->prepare($sql);

            $result = $stmt->execute([
                'user_id' => $reviewData['user_id'],
                'entity_id' => $reviewData['entity_id'],
                'parent_id' => $reviewData['parent_id'] ?? null,
                'description' => $reviewData['description']
            ]);

            if (!$result) {
                throw new Exception("Failed to create review");
            }

            $reviewId = $this->db->pdo->lastInsertId();

            if (!empty($traitRatings)) {
                $traitSql = "INSERT INTO review_trait_rating (review_id, trait_id, rating) VALUES (:review_id, :trait_id, :rating)";
                $traitStmt = $this->db->pdo->prepare($traitSql);

                foreach ($traitRatings as $traitRating) {
                    $traitResult = $traitStmt->execute([
                        'review_id' => $reviewId,
                        'trait_id' => $traitRating['trait_id'],
                        'rating' => intval($traitRating['rating'])
                    ]);

                    if (!$traitResult) {
                        throw new Exception("Failed to save trait rating for trait ID: " . $traitRating['trait_id']);
                    }
                }
            }


            if (!empty($pictures)) {
                $pictureSql = "INSERT INTO review_pictures (review_id, path) VALUES (:review_id, :path)";
                $pictureStmt = $this->db->pdo->prepare($pictureSql);

                foreach ($pictures as $picturePath) {
                    $pictureResult = $pictureStmt->execute([
                        'review_id' => $reviewId,
                        'path' => $picturePath
                    ]);

                    if (!$pictureResult) {
                        throw new Exception("Failed to save picture: $picturePath");
                    }
                }
            }


            $this->db->pdo->commit();
            return true;
        } catch (Exception $e) {

            $this->db->pdo->rollBack();
            error_log("Error creating review: " . $e->getMessage());
            return false;
        }
    }

    public function getVotesByReviewId($reviewId)
    {
        try {

            $likesSql = "SELECT COUNT(*) as count FROM review_votes WHERE review_id = :review_id AND vote_type = 'like'";
            $likesStmt = $this->db->pdo->prepare($likesSql);
            $likesStmt->execute(['review_id' => $reviewId]);
            $likes = $likesStmt->fetch()['count'];


            $dislikesSql = "SELECT COUNT(*) as count FROM review_votes WHERE review_id = :review_id AND vote_type = 'dislike'";
            $dislikesStmt = $this->db->pdo->prepare($dislikesSql);
            $dislikesStmt->execute(['review_id' => $reviewId]);
            $dislikes = $dislikesStmt->fetch()['count'];

            return [
                'likes' => (int)$likes,
                'dislikes' => (int)$dislikes
            ];
        } catch (Exception $e) {
            error_log("Error getting votes: " . $e->getMessage());
            return ['likes' => 0, 'dislikes' => 0];
        }
    }

    public function getUserVote($reviewId, $userId)
    {
        try {
            $sql = "SELECT vote_type FROM review_votes WHERE review_id = :review_id AND user_id = :user_id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['review_id' => $reviewId, 'user_id' => $userId]);

            $result = $stmt->fetch();
            return $result ? $result['vote_type'] : null;
        } catch (Exception $e) {
            error_log("Error getting user vote: " . $e->getMessage());
            return null;
        }
    }

    public function addVote($reviewId, $userId, $voteType)
    {
        try {

            $this->removeVote($reviewId, $userId);


            $sql = "INSERT INTO review_votes (review_id, user_id, vote_type) VALUES (:review_id, :user_id, :vote_type)";
            $stmt = $this->db->pdo->prepare($sql);

            return $stmt->execute([
                'review_id' => $reviewId,
                'user_id' => $userId,
                'vote_type' => $voteType
            ]);
        } catch (Exception $e) {
            error_log("Error adding vote: " . $e->getMessage());
            return false;
        }
    }

    public function removeVote($reviewId, $userId)
    {
        try {
            $sql = "DELETE FROM review_votes WHERE review_id = :review_id AND user_id = :user_id";
            $stmt = $this->db->pdo->prepare($sql);

            return $stmt->execute([
                'review_id' => $reviewId,
                'user_id' => $userId
            ]);
        } catch (Exception $e) {
            error_log("Error removing vote: " . $e->getMessage());
            return false;
        }
    }

    public function getTotalReviewsCount(): int
    {
        try {
            $sql = "SELECT COUNT(*) as count FROM {$this->table}";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute();
            return (int)$stmt->fetch(PDO::FETCH_ASSOC)['count'];
        } catch (PDOException $e) {
            error_log("Error counting total reviews: " . $e->getMessage());
            return 0;
        }
    }

    public function getReports() {
        try {
            $sql = "SELECT rr.id, rr.description, CONCAT(u.first_name, ' ', u.last_name) as user, r.description as review, e.name as entity_name
                    FROM reported_reviews rr
                    JOIN users u ON rr.user_id = u.id
                    JOIN reviews r ON rr.review_id = r.id
                    JOIN entities e ON r.entity_id = e.id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching review reports: " . $e->getMessage());
            return [];
        }
    }

    public function addReport($user_id, $review_id, $description) {
        try {
            $sql = "INSERT INTO reported_reviews (user_id, review_id, description) VALUES (:user_id, :review_id, :description)";
            $stmt = $this->db->pdo->prepare($sql);
            $result = $stmt->execute([
                'user_id' => $user_id,
                'review_id' => $review_id,
                'description' => $description
            ]);
            return $result;
        } catch (PDOException $e) {
            error_log("Error adding review report: " . $e->getMessage());
            return false;
        }
    }
    
    public function handleReport($report_id, $approved) {
        try {

            $sql = "SELECT review_id FROM reported_reviews WHERE id = :report_id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['report_id' => $report_id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$row) {
                return false;
            }
            $review_id = $row['review_id'];


            $sql = "DELETE FROM reported_reviews WHERE id = :report_id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['report_id' => $report_id]);

            if ($approved) {
                $this->deleteReviewAndChildren($review_id);
            }
            return true;
        } catch (PDOException $e) {
            error_log("Error handling report: " . $e->getMessage());
            return false;
        }
    }

    public function deleteReviewAndChildren($review_id) {
        $sql = "SELECT id FROM reviews WHERE parent_id = :parent_id";
        $stmt = $this->db->pdo->prepare($sql);
        $stmt->execute(['parent_id' => $review_id]);
        $children = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        foreach ($children as $child_id) {
            $this->deleteReviewAndChildren($child_id);
        }
        $sql = "DELETE FROM reviews WHERE id = :review_id";
        $stmt = $this->db->pdo->prepare($sql);
        $stmt->execute(['review_id' => $review_id]);
    }


    public function getReviewsByUserId($userId)
    {
        try {
            $sql = "SELECT * FROM {$this->table} WHERE user_id = :user_id";
            $stmt = $this->db->pdo->prepare($sql);
            $stmt->execute(['user_id' => $userId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching reviews by user ID: " . $e->getMessage());
            return [];
        }
    }
}
