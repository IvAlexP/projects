"""Handles level completion bonus animations."""

import pygame
from config import (
    LEVEL_COMPLETED_BONUS_DELAY,
    BONUS_TEXT_DURATION,
    BONUS_POINT_COLOR,
)
from model import Grid


class BonusAnimator:
    """Manages level completion bonus animations."""

    def __init__(self, renderer, screen):
        """Initializes the bonus animator.

        Args:
            renderer: The renderer instance for drawing.
            screen: The pygame screen surface.
        """
        self.renderer = renderer
        self.screen = screen
        self.bonus_text_animations = {}  # {(row, col): start_time}
        self.level_completed_bonus_cells = []
        self.level_completed_bonus_index = 0
        self.last_bonus_time = 0

    def initialize_level_completed_bonus(self, grid: Grid) -> None:
        """Initializes the level completed bonus animation.

        Args:
            grid: The game grid.
        """
        self.level_completed_bonus_cells = []
        self.level_completed_bonus_index = 0

        for row in range(grid.rows):
            for col in range(grid.cols):
                bubble = grid.get(row, col)
                if bubble:
                    self.level_completed_bonus_cells.append(
                        ("bubble", row, col, bubble.get_color())
                    )
                else:
                    self.level_completed_bonus_cells.append(
                        ("empty", row, col)
                    )

        self.last_bonus_time = pygame.time.get_ticks()

    def update_level_completed_bonus(
        self,
        grid: Grid,
        is_bonus_active: bool,
        points_per_empty_cell: int,
        pop_animator,
    ) -> int:
        """Updates the level completed bonus animation.

        Args:
            grid: The game grid.
            is_bonus_active: Whether the bonus animation is active.
            points_per_empty_cell: Points awarded per empty cell.
            pop_animator: The pop animator for adding bubble pops.

        Returns:
            int: Points earned this frame.
        """
        if not is_bonus_active:
            return 0

        bonus_index = self.level_completed_bonus_index
        total_cells = len(self.level_completed_bonus_cells)
        if bonus_index >= total_cells:
            return 0

        current_time = pygame.time.get_ticks()
        if current_time - self.last_bonus_time >= LEVEL_COMPLETED_BONUS_DELAY:
            cell_data = self.level_completed_bonus_cells[
                self.level_completed_bonus_index
            ]
            points = 0

            if cell_data[0] == "bubble":
                _, row, col, color = cell_data
                pop_animator.add_popping_bubble(row, col, color)
                grid.set(row, col, None)
            else:
                _, row, col = cell_data
                points = points_per_empty_cell
                self.bonus_text_animations[(row, col)] = current_time

            self.level_completed_bonus_index += 1
            self.last_bonus_time = current_time

            return points

        return 0

    def draw_bonus_text(self, points_per_empty_cell: int) -> None:
        """Draws bonus text animations.

        Args:
            points_per_empty_cell: Points value to display.
        """
        current_time = pygame.time.get_ticks()
        cells_to_remove = []

        for (row, col), start_time in self.bonus_text_animations.items():
            elapsed = current_time - start_time

            if elapsed < BONUS_TEXT_DURATION:
                x, y = self.renderer.bubble_coordinates(row, col)
                font = pygame.font.Font(None, 20)
                text = font.render(
                    f"{points_per_empty_cell}", True, BONUS_POINT_COLOR
                )
                text_rect = text.get_rect(center=(x, y))
                self.screen.blit(text, text_rect)
            else:
                cells_to_remove.append((row, col))

        for pos in cells_to_remove:
            del self.bonus_text_animations[pos]

    def is_animating(self) -> bool:
        """Checks if any bonus animations are active.

        Returns:
            bool: True if animations are running.
        """
        return bool(self.bonus_text_animations)

    def is_complete(self) -> bool:
        """Checks if all bonus cells have been processed.

        Returns:
            bool: True if bonus animation sequence is complete.
        """
        return self.level_completed_bonus_index >= len(
            self.level_completed_bonus_cells
        )
