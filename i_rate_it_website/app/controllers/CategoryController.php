<?php
/**
 * Controller for managing categories and traits.
 * Handles operations like retrieving all categories, getting traits by category etc.
 * Requires owner access for creating categories.
 */
class CategoryController extends BaseController
{
    private Category $categoryModel;
    private TraitModel $traitModel;

    public function __construct()
    {
        parent::__construct();
        $this->categoryModel = new Category();
        $this->traitModel = new TraitModel();
    }

    public function getCategoryById($categoryId)
    {
        try {
            $category = $this->categoryModel->getById($categoryId);
            if (!$category) {
                Response::error('Category not found', 404);
                return;
            }
            Response::success(['category' => $category]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function getAllCategories()
    {
        try {
            $categories = $this->categoryModel->getAll();
            Response::success(['categories' => $categories]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function getTraitsByCategory($categoryId)
    {
        try {
            $traits = $this->traitModel->getByCategoryId($categoryId);
            Response::success(['traits' => $traits]);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function createCategory()
    {
        $ownerUser = $this->requireOwnerAccess();
        if (!$ownerUser) {
            return;
        }

        $data = $this->getRequestData();
        if (!$data) {
            Response::error('No data provided', 400);
            return;
        }

        if (empty($data['name'])) {
            Response::error('Category name is required', 400);
            return;
        }

        if (empty($data['traits']) || !is_array($data['traits']) || count($data['traits']) !== 5) {
            Response::error('Exactly 5 traits are required for a new category', 400);
            return;
        }

        foreach ($data['traits'] as $index => $trait) {
            if (empty(trim(InputSanitizer::sanitizeText($trait)))) {
                Response::error("Trait " . ($index + 1) . " cannot be empty", 400);
                return;
            }
        }

        try {
            $categoryData = [
                'name' => InputSanitizer::sanitizeText(trim($data['name']))
            ];

            $categoryId = $this->categoryModel->create($categoryData);
            if (!$categoryId) {
                Response::error('Failed to create category', 500);
                return;
            }
            
            $createdTraits = [];
            foreach ($data['traits'] as $traitName) {
                $traitData = [
                    'name' => InputSanitizer::sanitizeText(trim($traitName)),
                    'category_id' => $categoryId
                ];

                $traitId = $this->traitModel->create($traitData);
                if (!$traitId) {
                    Response::error("Failed to create trait: " . $traitName . " for category ID: " . $categoryId, 500);
                } else {
                    $createdTraits[] = [
                        'id' => $traitId,
                        'name' => InputSanitizer::sanitizeText(trim($traitName))
                    ];
                }
            }

            Response::success([
                'message' => 'Category created successfully',
                'category_id' => $categoryId,
                'traits' => $createdTraits
            ]);
        } catch (Exception $e) {
            error_log("Error creating category: " . $e->getMessage());
            Response::error('Failed to create category', 500);
        }
    }
}
