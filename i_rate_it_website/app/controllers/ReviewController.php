<?php
/**
 * Controller for managing reviews.
 * Handles operations like creating reviews, getting reviews by entity ID, voting on reviews, and managing review reports.
 */
class ReviewController extends BaseController
{
    private Review $reviewModel;

    public function __construct()
    {
        parent::__construct();
        $this->reviewModel = new Review();
    }

    public function getReviewsByEntityId(int $entityId): void
    {
        try {
            if ($entityId <= 0) {
                throw new Exception('Invalid entity ID');
            }
            $reviews = $this->reviewModel->getByEntityId($entityId);

            Response::success(['reviews' => $reviews]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }

    public function createReview(): void
    {
        $user = $this->requireAuthentication();
        if (!$user) {
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            Response::error('Invalid request data', 400);
            return;
        }

        $entityId = (int)($input['entity_id'] ?? 0);
        $parentId = isset($input['parent_id']) ? (int)$input['parent_id'] : null;

        if ($entityId <= 0) {
            Response::error('Entity ID is required', 400);
            return;
        }

        if ($parentId === null) {
            $validation = $this->validateMainReview($input);
            if (!$validation['valid']) {
                Response::error($validation['error'], 400);
                return;
            }
            $rating = $validation['rating'];
            $description = $validation['description'];
            $traitRatings = $input['trait_ratings'] ?? [];
        } else {
            if (!isset($input['description']) || empty(trim($input['description']))) {
                Response::error('Description is required for replies', 400);
                return;
            }
            $rating = null;
            $description = InputSanitizer::sanitizeText(trim($input['description']));
            $traitRatings = [];
        }

        $reviewData = [
            'entity_id' => $entityId,
            'user_id' => $user['id'],
            'description' => $description
        ];

        if ($parentId !== null) {
            $reviewData['parent_id'] = $parentId;
        }

        if ($rating !== null) {
            $reviewData['rating'] = $rating;
        }

        $pictures = $input['pictures'] ?? [];
        $reviewId = $this->reviewModel->create($reviewData, $traitRatings, $pictures);

        if (!$reviewId) {
            Response::error('Failed to create review', 500);
            return;
        }

        Response::success([
            'message' => 'Review created successfully',
            'review_id' => $reviewId
        ]);
    }

    private function validateMainReview(array $input): array
    {
        $requiredFields = ['rating', 'description'];
        foreach ($requiredFields as $field) {
            if (!isset($input[$field]) || empty(trim($input[$field]))) {
                return ['valid' => false, 'error' => "Field '$field' is required"];
            }
        }

        $rating = (int)$input['rating'];
        if ($rating < 1 || $rating > 5) {
            return ['valid' => false, 'error' => 'Rating must be between 1 and 5'];
        }
        return [
            'valid' => true,
            'rating' => $rating,
            'description' => InputSanitizer::sanitizeText(trim($input['description']))
        ];
    }

    public function getUserVote(int $reviewId): void
    {
        if ($reviewId <= 0) {
            Response::error('Invalid review ID', 400);
            return;
        }

        $user = $this->requireAuthentication();
        if (!$user) {
            return;
        }

        $userVote = $this->reviewModel->getUserVote($reviewId, $user['id']);
        Response::success(['user_vote' => $userVote]);
    }
    
    public function voteReview(): void
    {
        $input = $this->getRequestData();

        $reviewId = (int)($input['review_id'] ?? 0);
        $voteType = $input['vote_type'] ?? '';

        if ($reviewId <= 0) {
            Response::error('Invalid review ID', 400);
            return;
        }

        if (!in_array($voteType, ['like', 'dislike'])) {
            Response::error('Vote type must be "like" or "dislike"', 400);
            return;
        }

        $user = $this->requireAuthentication();
        if (!$user) {
            return;
        }

        $result = $this->reviewModel->addVote($reviewId, $user['id'], $voteType);
        if (!$result) {
            Response::error('Failed to register vote', 500);
            return;
        }

        $votes = $this->reviewModel->getVotesByReviewId($reviewId);
        $userVote = $this->reviewModel->getUserVote($reviewId, $user['id']);

        Response::success([
            'votes' => $votes,
            'user_vote' => $userVote
        ]);
    }

    public function removeVote(): void
    {
        $input = $this->getRequestData();

        $reviewId = (int)($input['review_id'] ?? 0);

        if ($reviewId <= 0) {
            Response::error('Invalid review ID', 400);
            return;
        }

        $user = $this->requireAuthentication();
        if (!$user) {
            return;
        }

        $result = $this->reviewModel->removeVote($reviewId, $user['id']);
        if (!$result) {
            Response::error('Failed to remove vote', 500);
            return;
        }

        $votes = $this->reviewModel->getVotesByReviewId($reviewId);
        $userVote = $this->reviewModel->getUserVote($reviewId, $user['id']);

        Response::success([
            'votes' => $votes,
            'user_vote' => $userVote
        ]);
    }

    public function getReviewReports(): void
    {
        if (!$this->checkAdminAccess()) {
            Response::error('Access denied', 403);
            return;
        }

        try {
            $reports = $this->reviewModel->getReports();
            Response::success(['reports' => $reports]);
        } catch (Exception $e) {
            Response::error('Failed to fetch review reports', 500);
        }
    }
    
    public function addReviewReport(): void
    {
        $user = $this->requireAuthentication();
        if (!$user) {
            return;
        }

        $input = $this->getRequestData();

        $reviewId = (int)($input['review_id'] ?? 0);
        $description = trim($input['description'] ?? '');

        if ($reviewId <= 0 || empty($description)) {
            Response::error('Review ID and description are required', 400);
            return;
        }

        $result = $this->reviewModel->addReport($user['id'], $reviewId, $description);
        if (!$result) {
            Response::error('Failed to add review report', 500);
            return;
        }

        Response::success(['message' => 'Review report added successfully']);
    }

    public function approveReviewReport(): void
    {
        $user = $this->requireAuthentication();
        if (!$user || !$this->checkAdminAccess()) {
            Response::error('Access denied', 403);
            return;
        }

        $input = $this->getRequestData();
        $reportId = (int)($input['report_id'] ?? 0);
        if ($reportId <= 0) {
            Response::error('Report ID is required', 400);
            return;
        }

        $result = $this->reviewModel->handleReport($reportId, true);
        if (!$result) {
            Response::error('Failed to approve report', 500);
            return;
        }

        Response::success(['message' => 'Report approved and review deleted']);
    }

    public function cancelReviewReport(): void
    {
        $user = $this->requireAuthentication();
        if (!$user || !$this->checkAdminAccess()) {
            Response::error('Access denied', 403);
            return;
        }

        $input = $this->getRequestData();
        $reportId = (int)($input['report_id'] ?? 0);
        if ($reportId <= 0) {
            Response::error('Report ID is required', 400);
            return;
        }
        
        $result = $this->reviewModel->handleReport($reportId, false);
        if (!$result) {
            Response::error('Failed to cancel report', 500);
            return;
        }

        Response::success(['message' => 'Report cancelled']);
    }
}
