<?php
/**
 * Entity Data Transfer Object (DTO) for representing entities in the system.
 */
class EntityDto
{
    public $id;
    public $name;
    public $description;
    public $picture;
    public $city;
    public $category_id;
    public $traits;
    public $owner_name;

    public function __construct($id, $name, $description, $picture, $city = null, $category_id = null, $traits = [])
    {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->picture = $picture;
        $this->city = $city;
        $this->category_id = $category_id;
        $this->traits = $traits;
    }

    public function addTrait(TraitDto $trait)
    {
        $this->traits[] = $trait;
    }

    public function setCategoryId($categoryId)
    {
        $this->category_id = $categoryId;
    }
    public function toArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'picture' => $this->picture,
            'city' => $this->city,
            'category_id' => $this->category_id,
            'traits' => array_map(function ($trait) {
                return $trait->toArray();
            }, $this->traits),
            'owner_name' => $this->owner_name ?? null
        ];
    }
}
