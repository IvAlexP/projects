"""Handles popping/explosion animations for bubbles."""

import pygame
from config import POP_ANIMATION_DURATION
from model import Grid


class PopAnimator:
    """Manages bubble popping animations."""

    def __init__(self, renderer):
        """Initializes the pop animator.

        Args:
            renderer: The renderer instance for drawing.
        """
        self.renderer = renderer
        self.popping_bubbles = {}  # {(row, col): (start_time, color)}

    def add_popping_bubble(
        self, row: int, col: int, color: tuple[int, int, int]
    ) -> None:
        """Adds a bubble to the popping animation.

        Args:
            row: Row index.
            col: Column index.
            color: RGB color of the bubble.
        """
        current_time = pygame.time.get_ticks()
        self.popping_bubbles[(row, col)] = (current_time, color)

    def draw_and_update(self, grid: Grid) -> bool:
        """Draws and updates popping animations.

        Args:
            grid: The game grid.

        Returns:
            bool: True if any bubbles finished popping this frame.
        """
        current_time = pygame.time.get_ticks()
        bubbles_to_remove = []

        for (row, col), (start_time, color) in self.popping_bubbles.items():
            elapsed = current_time - start_time

            if elapsed < POP_ANIMATION_DURATION:
                progress = 1.0 - (elapsed / POP_ANIMATION_DURATION)
                self.renderer.draw_popping_bubble(row, col, color, progress)
            else:
                bubbles_to_remove.append((row, col))

        for pos in bubbles_to_remove:
            del self.popping_bubbles[pos]

        return len(bubbles_to_remove) > 0

    def is_animating(self) -> bool:
        """Checks if any popping animations are active.

        Returns:
            bool: True if animations are running.
        """
        return bool(self.popping_bubbles)
