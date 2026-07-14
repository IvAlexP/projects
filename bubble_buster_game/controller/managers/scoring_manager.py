"""Manages scoring and points calculation."""

from config import (
    POINTS_PER_BUBBLE,
    BASE_POINTS_PER_EMPTY_CELL,
    INCREASE_POINTS_PER_EMPTY_CELL_PER_LEVEL,
)


class ScoringManager:
    """Handles all scoring logic and calculations."""

    def __init__(self) -> None:
        """Initializes the scoring manager."""
        self.score = 0

    def add_bubble_pop_score(self, bubble_count: int) -> None:
        """Adds score for popping bubbles.

        Args:
            bubble_count (int): Number of bubbles popped.
        """
        points = (bubble_count - 1) * POINTS_PER_BUBBLE
        self.score += points

    def add_bonus_score(self, points: int) -> None:
        """Adds bonus points (e.g., from level completion).

        Args:
            points (int): Points to add.
        """
        self.score += points

    def get_score(self) -> int:
        """Returns the current score.

        Returns:
            int: Current score.
        """
        return self.score

    @staticmethod
    def points_per_empty_cell(level: int) -> int:
        """Calculates the points awarded per empty cell based on level.

        Args:
            level (int): The current level.

        Returns:
            int: Points awarded per empty cell.
        """
        return (
            BASE_POINTS_PER_EMPTY_CELL
            + (level - 1) * INCREASE_POINTS_PER_EMPTY_CELL_PER_LEVEL
        )
