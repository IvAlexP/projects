<?php
/**
 * Controller for handling file uploads and management.
 * Supports uploading pictures, entity pictures, renaming files and deleting files.
 */
class FileController extends BaseController
{
    public function uploadPicture(): void
    {
        $user = $this->requireAuthentication();
        if (!$user) {
            return;
        }

        if (!isset($_FILES['picture'])) {
            Response::error('No file field named "picture" found', 400);
            return;
        }

        $folder = $_POST['folder'] ?? 'pictures';
        $allowedFolders = ['pictures', 'entities', 'reviews'];

        if (!in_array($folder, $allowedFolders)) {
            Response::error('Invalid folder. Allowed folders: ' . implode(', ', $allowedFolders), 400);
            return;
        }

        $file = $_FILES['picture'];

        if ($file['error'] !== UPLOAD_ERR_OK) {
            $errorMessages = [
                UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize',
                UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE',
                UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
                UPLOAD_ERR_NO_FILE => 'No file was uploaded',
                UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
                UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
                UPLOAD_ERR_EXTENSION => 'File upload stopped by extension'
            ];
            $errorMsg = $errorMessages[$file['error']] ?? 'Unknown upload error';
            Response::error($errorMsg, 400);
            return;
        }

        $entityId = $_POST['entity_id'] ?? null;
        $uploadResult = $this->handleFileUpload($file, $folder, $entityId);

        if ($uploadResult['success']) {
            Response::success([
                'file_path' => $uploadResult['web_path'],
                'filename' => $uploadResult['filename'],
                'folder' => $folder
            ]);
        } else {
            Response::error($uploadResult['error'], 400);
        }
    }

    public function uploadEntityPicture($entityId): array
    {
        if (!isset($_FILES['picture']) || $_FILES['picture']['error'] !== UPLOAD_ERR_OK) {
            return ['success' => false, 'error' => 'No valid file uploaded'];
        }

        return $this->handleFileUpload($_FILES['picture'], 'entities', $entityId);
    }

    private function handleFileUpload(array $file, string $folder, $entityId = null): array
    {
        $uploadDir = PDIR . '/assets/' . $folder . '/';

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $allowedTypes)) {
            return ['success' => false, 'error' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed. Detected: ' . $mimeType];
        }

        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $allowedExtensions)) {
            return ['success' => false, 'error' => 'Invalid file extension. Only jpg, jpeg, png, gif, and webp are allowed.'];
        }

        $maxSize = 5 * 1024 * 1024;
        if ($file['size'] > $maxSize) {
            return ['success' => false, 'error' => 'File too large. Maximum size is 5MB.'];
        }

        if ($folder === 'entities' && $entityId) {
            $filename = $entityId . '_' . time() . '.' . $extension;
        } elseif ($folder === 'reviews') {
            $filename = uniqid('review_', true) . '.' . $extension;
        } else {
            $filename = uniqid('picture_', true) . '.' . $extension;
        }

        $uploadPath = $uploadDir . $filename;
        $webPath = '/assets/' . $folder . '/' . $filename;

        if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
            return [
                'success' => true,
                'filename' => $filename,
                'web_path' => $webPath,
                'full_path' => $uploadPath
            ];
        } else {
            return ['success' => false, 'error' => 'Failed to save file. Check server permissions.'];
        }
    }

    public function renameEntityFile(string $oldFilename, int $entityId): array
    {
        $fileExtension = pathinfo($oldFilename, PATHINFO_EXTENSION);
        $newFilename = $entityId . '.' . $fileExtension;
        $oldPath = PDIR . '/assets/entities/' . $oldFilename;
        $newPath = PDIR . '/assets/entities/' . $newFilename;

        if (file_exists($oldPath)) {
            if (rename($oldPath, $newPath)) {
                return [
                    'success' => true,
                    'new_filename' => $newFilename,
                    'web_path' => '/assets/entities/' . $newFilename
                ];
            }
        }

        return ['success' => false, 'error' => 'Failed to rename file'];
    }

    public function deletePicture()
    {
        try {
            $token = JWTHelper::getTokenFromHeaders();
            if (!$token) {
                Response::error('Access token is required', 401);
                return;
            }

            $user_data = JWTHelper::getUserDataFromToken($token);
            if (!$user_data) {
                Response::error('Invalid or expired token', 401);
                return;
            }

            $input = json_decode(file_get_contents('php://input'), true);
            if (!isset($input['file_path'])) {
                Response::error('File path is required', 400);
                return;
            }

            $filePath = $input['file_path'];
            $filePath = ltrim($filePath, '/');
            
            if (!preg_match('#^assets/(reviews|pictures|entities)/#', $filePath)) {
                Response::error('Invalid file path or unauthorized directory', 400);
                return;
            }

            $fullPath = dirname(dirname(__DIR__)) . '/public/' . $filePath;
            
            if (!file_exists($fullPath)) {
                Response::error('File not found', 404);
                return;
            }

            if (unlink($fullPath)) {
                Response::success(['message' => 'File deleted successfully']);
            } else {
                Response::error('Failed to delete file', 500);
            }

        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
}
