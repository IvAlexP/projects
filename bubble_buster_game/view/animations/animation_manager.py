"""Coordinates all game animations (popping, falling, bonus)."""

from model import Grid
from .pop_animator import PopAnimator
from .fall_animator import FallAnimator
from .bonus_animator import BonusAnimator


class AnimationManager:
    """Coordinates all animation types in the game."""

    def __init__(self, renderer, screen):
        """Initializes the animation manager with specialized animators.

        Args:
            renderer: The renderer instance for drawing.
            screen: The pygame screen surface.
        """
        self.pop_animator = PopAnimator(renderer)
        self.fall_animator = FallAnimator(renderer)
        self.bonus_animator = BonusAnimator(renderer, screen)

    def add_popping_bubble(
        self, row: int, col: int, color: tuple[int, int, int]
    ) -> None:
        """Adds a bubble to the popping animation.

        Args:
            row: Row index.
            col: Column index.
            color: RGB color of the bubble.
        """
        self.pop_animator.add_popping_bubble(row, col, color)

    def draw_and_update_popping(self, grid: Grid) -> bool:
        """Draws and updates popping animations.

        Args:
            grid: The game grid.

        Returns:
            bool: True if any bubbles finished popping this frame.
        """
        return self.pop_animator.draw_and_update(grid)

    def start_falling_animations(self, moves: dict, grid: Grid) -> None:
        """Starts falling animations for moved bubbles.

        Args:
            moves: Dictionary of (from_row, from_col) -> (to_row, to_col).
            grid: The game grid.
        """
        self.fall_animator.start_animations(moves, grid)

    def draw_and_update_falling(self) -> None:
        """Draws and updates falling animations."""
        self.fall_animator.draw_and_update()

    def get_falling_destinations(self) -> set:
        """Gets positions of bubbles currently falling.

        Returns:
            set: Set of positions that are destinations of falling bubbles.
        """
        return self.fall_animator.get_falling_destinations()

    def initialize_level_completed_bonus(self, grid: Grid) -> None:
        """Initializes the level completed bonus animation.

        Args:
            grid: The game grid.
        """
        self.bonus_animator.initialize_level_completed_bonus(grid)

    def update_level_completed_bonus(
        self, grid: Grid, is_bonus_active: bool, points_per_empty_cell: int
    ) -> int:
        """Updates the level completed bonus animation.

        Args:
            grid: The game grid.
            is_bonus_active: Whether the bonus animation is active.
            points_per_empty_cell: Points awarded per empty cell.

        Returns:
            int: Points earned this frame.
        """
        return self.bonus_animator.update_level_completed_bonus(
            grid, is_bonus_active, points_per_empty_cell, self.pop_animator
        )

    def draw_bonus_text(self, points_per_empty_cell: int) -> None:
        """Draws bonus text animations.

        Args:
            points_per_empty_cell: Points value to display.
        """
        self.bonus_animator.draw_bonus_text(points_per_empty_cell)

    def has_active_animations(self) -> bool:
        """Checks if any animations are currently active.

        Returns:
            bool: True if any animations are running.
        """
        return (
            self.pop_animator.is_animating()
            or self.fall_animator.is_animating()
            or self.bonus_animator.is_animating()
        )

    def clear_all_animations(self) -> None:
        """Clears all active animations."""
        self.pop_animator.popping_bubbles.clear()
        self.fall_animator.falling_bubbles.clear()
        self.bonus_animator.bonus_text_animations.clear()
        self.bonus_animator.level_completed_bonus_cells.clear()
        self.bonus_animator.level_completed_bonus_index = 0

    def is_bonus_complete(self) -> bool:
        """Checks if bonus animation is complete.

        Returns:
            bool: True if all bonus cells processed and no animations running.
        """
        return (
            self.bonus_animator.is_complete()
            and not self.has_active_animations()
        )
