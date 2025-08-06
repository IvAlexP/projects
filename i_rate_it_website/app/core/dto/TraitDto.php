<?php
/**
 * Trait Data Transfer Object (DTO) for representing traits in the system.
 */
class TraitDto
{
    public $id;
    public $name;
    public $averageRating;

    public function __construct($id, $name, $averageRating = 0.0)
    {
        $this->id = $id;
        $this->name = $name;
        $this->averageRating = round($averageRating, 2);
    }

    public function toArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'averageRating' => $this->averageRating
        ];
    }
}
