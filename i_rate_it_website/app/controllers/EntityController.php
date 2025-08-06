<?php
/**
 * Controller for managing entities.
 * Handles operations like fetching entities by category, creating, updating, deleting entities and managing entity pictures.
 * Requires owner access for creating and updating entities.
 */
class EntityController extends BaseController
{
    private Entity $entityModel;
    private FileController $fileController;

    public function __construct()
    {
        parent::__construct();
        $this->entityModel = new Entity();
        $this->fileController = new FileController();
    }

    public function getEntitiesByCategory($categoryId)
    {
        try {
            $entities = $this->entityModel->getByCategory($categoryId);

            if ($entities === false) {
                Response::error('Failed to fetch entities', 500);
                return;
            }
            $entitiesArray = array_map(function ($entity) {
                return $entity->toArray();
            }, $entities);

            Response::success(['entities' => $entitiesArray]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function getEntityById($id)
    {
        try {
            $entity = $this->entityModel->getById($id);

            if ($entity === false) {
                Response::error('Entity not found', 404);
                return;
            }

            Response::success(['entity' => $entity->toArray()]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function getMyEntities(): void
    {
        $user = $this->getCurrentAuthenticatedUser();
        if (!$user) {
            Response::error('Authentication required', 401);
            return;
        }

        $entities = $this->entityModel->getByOwnerId($user['id']);
        Response::success(['entities' => $entities ?: []]);
    }

    public function updateEntity($entityId): void
    {
        $user = $this->getCurrentAuthenticatedUser();
        if (!$user) {
            Response::error('Authentication required', 401);
            return;
        }

        $entity = $this->entityModel->getRawById($entityId);
        if (!$entity) {
            Response::error('Entity not found', 404);
            return;
        }

        if ($entity['owner_id'] != $user['id']) {
            Response::error('You can only edit your own entities', 403);
            return;
        }
        $updateData = $this->getEntityData();
        if (!$updateData) {
            Response::error('No data provided', 400);
            return;
        }

        if (empty($updateData['name'])) {
            Response::error('Entity name is required', 400);
            return;
        }

        if (empty($updateData['city'])) {
            Response::error('City is required', 400);
            return;
        }

        if (isset($_FILES['picture']) && $_FILES['picture']['error'] == UPLOAD_ERR_OK) {
            $uploadResult = $this->fileController->uploadEntityPicture($entityId);
            if ($uploadResult['success']) {
                $updateData['picture'] = $uploadResult['web_path'];
            } else {
                Response::error($uploadResult['error'], 400);
                return;
            }
        }

        $success = $this->entityModel->update($entityId, $updateData);
        if ($success) {
            Response::success('Entity updated successfully');
        } else {
            Response::error('Failed to update entity', 500);
        }
    }

    public function createEntity(): void
    {
        $user = $this->getCurrentAuthenticatedUser();
        if (!$user) {
            Response::error('Authentication required', 401);
            return;
        }

        $createData = $this->getEntityData();
        if (!$createData) {
            Response::error('No data provided', 400);
            return;
        }

        if (empty($createData['name'])) {
            Response::error('Entity name is required', 400);
            return;
        }

        if (empty($createData['city'])) {
            Response::error('City is required', 400);
            return;
        }

        if (empty($createData['category_id'])) {
            Response::error('Category is required', 400);
            return;
        }

        $uploadResult = null;
        if (isset($_FILES['picture']) && $_FILES['picture']['error'] == UPLOAD_ERR_OK) {
            $tempEntityId = 'temp_' . time() . '_' . $user['id'];
            $uploadResult = $this->fileController->uploadEntityPicture($tempEntityId);
            if ($uploadResult['success']) {
                $createData['picture'] = $uploadResult['web_path'];
            } else {
                Response::error($uploadResult['error'], 400);
                return;
            }
        }

        $entityId = $this->entityModel->create($createData, $user['id']);
        if (!$entityId) {
            Response::error('Failed to create entity', 500);
            return;
        }

        if ($uploadResult && $uploadResult['success']) {
            $renameResult = $this->fileController->renameEntityFile($uploadResult['filename'], $entityId);
            if ($renameResult['success']) {
                $this->entityModel->update($entityId, ['picture' => $renameResult['web_path']]);
            }
        }

        Response::success([
            'message' => 'Entity created successfully',
            'entity_id' => $entityId
        ]);
    }

    public function deleteEntity($id): void
    {
        $user = $this->getCurrentAuthenticatedUser();
        if (!$user) {
            Response::error('Authentication required', 401);
            return;
        }

        $entity = $this->entityModel->getRawById($id);
        if (!$entity) {
            Response::error('Entity not found', 404);
            return;
        }

        if ($entity['owner_id'] != $user['id']) {
            Response::error('Not authorized to delete this entity', 403);
            return;
        }

        if ($entity['picture']) {
            $imagePath = PDIR . '/assets/entities/' . basename($entity['picture']);
            if (file_exists($imagePath)) {
                unlink($imagePath);
                error_log("Deleted entity image: " . $imagePath);
            }
        }

        $result = $this->entityModel->delete($id, $user['id']);
        if ($result) {
            $categoryId = $entity['category_id'];
            $categoryModel = new Category();
            $entitiesCount = $categoryModel->getEntitiesCount($categoryId);
            if ($entitiesCount === 0) {
                $traits = $categoryModel->getTraitsByCategoryId($categoryId);
                if (!empty($traits)) {
                    $db = DB::getInstance();
                    $sql = "DELETE FROM traits WHERE category_id = :category_id";
                    $stmt = $db->pdo->prepare($sql);
                    $stmt->execute(['category_id' => $categoryId]);
                }
                $categoryModel->delete($categoryId);
            }
            Response::success('Entity deleted successfully');
        } else {
            Response::error('Failed to delete entity', 500);
        }
    }

    public function getNearbyEntities(): void
    {
        $user = $this->getCurrentAuthenticatedUser();
        if (!$user) {
            Response::error('User must be logged in to see nearby entities', 401);
            return;
        }

        if (empty($user['city'])) {
            Response::error('User city not set. Please update your profile with your city.', 400);
            return;
        }

        $entities = $this->entityModel->getNearbyEntities($user['city'], 6);
        if ($entities === false) {
            Response::error('Database error while fetching nearby entities', 500);
            return;
        }

        Response::success(['entities' => $entities, 'city' => $user['city']]);
    }

    // Admin methods for pending entities
    public function getPendingEntities(): void
    {
        $adminUser = $this->requireAdminAccess();
        if (!$adminUser) {
            return;
        }

        $pendingEntities = $this->entityModel->getPendingEntities();
        Response::success(['pendingEntities' => $pendingEntities]);
    }

    public function updateEntityStatus(): void
    {
        $adminUser = $this->requireAdminAccess();
        if (!$adminUser) {
            return;
        }

        $input = $this->getRequestData();

        $entityId = $input['entity_id'] ?? null;
        $status = $input['status'] ?? null;

        if (!$entityId || !in_array($status, ['approved', 'rejected'])) {
            Response::error('Invalid entity ID or status', 400);
            return;
        }

        $result = $this->entityModel->updateStatus($entityId, $status);
        if ($result) {
            Response::success("Entity {$status} successfully");
        } else {
            Response::error('Failed to update entity status', 500);
        }
    }

    private function getEntityData(): ?array
    {
        $data = $this->getRequestData();
        if (!$data) {
            if (!empty($_POST)) {
                return [
                    'name' => InputSanitizer::sanitizeText($_POST['name'] ?? ''),
                    'description' => InputSanitizer::sanitizeText($_POST['description'] ?? ''),
                    'city' => InputSanitizer::sanitizeText($_POST['city'] ?? ''),
                    'category_id' => !empty($_POST['category_id']) ? InputSanitizer::sanitizeInt($_POST['category_id']) : null
                ];
            }
            return null;
        }

        return [
            'name' => InputSanitizer::sanitizeText($data['name'] ?? ''),
            'description' => InputSanitizer::sanitizeText($data['description'] ?? ''),
            'city' => InputSanitizer::sanitizeText($data['city'] ?? ''),
            'category_id' => !empty($data['category_id']) ? InputSanitizer::sanitizeInt($data['category_id']) : null
        ];
    }
}
