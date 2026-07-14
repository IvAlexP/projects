"""Handles falling animations for bubbles."""

import pygame
from config import FALL_ANIMATION_DURATION
from model import Grid


class FallAnimator:
    """Manages bubble falling animations."""

    def __init__(self, renderer):
        """Initializes the fall animator.

        Args:
            renderer: The renderer instance for drawing.
        """
        self.renderer = renderer
        self.falling_bubbles = (
            {}
        )  # {(from_row, from_col): (start_time, to_row, to_col, color)}

    def start_animations(self, moves: dict, grid: Grid) -> None:
        """Starts falling animations for moved bubbles.

        Args:
            moves: Dictionary of (from_row, from_col) -> (to_row, to_col).
            grid: The game grid.
        """
        if not moves:
            return

        current_time = pygame.time.get_ticks()
        for (from_row, from_col), (to_row, to_col) in moves.items():
            bubble = grid.get(to_row, to_col)
            if bubble:
                self.falling_bubbles[(from_row, from_col)] = (
                    current_time,
                    to_row,
                    to_col,
                    bubble.get_color(),
                )

    def draw_and_update(self) -> None:
        """Draws and updates falling animations."""
        current_time = pygame.time.get_ticks()
        bubbles_to_remove = []

        for (from_row, from_col), (
            start_time,
            to_row,
            to_col,
            color,
        ) in self.falling_bubbles.items():
            elapsed = current_time - start_time

            if elapsed < FALL_ANIMATION_DURATION:
                progress = min(elapsed / FALL_ANIMATION_DURATION, 1.0)
                self.renderer.draw_falling_bubble(
                    from_row, from_col, to_row, to_col, color, progress
                )
            else:
                bubbles_to_remove.append((from_row, from_col))

        for pos in bubbles_to_remove:
            del self.falling_bubbles[pos]

    def get_falling_destinations(self) -> set:
        """Gets positions of bubbles currently falling.

        Returns:
            set: Set of positions that are destinations of falling bubbles.
        """
        falling_destinations = set()
        current_time = pygame.time.get_ticks()

        for _, (start_time, to_row, to_col, _) in self.falling_bubbles.items():
            elapsed = current_time - start_time
            if elapsed < FALL_ANIMATION_DURATION:
                falling_destinations.add((to_row, to_col))

        return falling_destinations

    def is_animating(self) -> bool:
        """Checks if any falling animations are active.

        Returns:
            bool: True if animations are running.
        """
        return bool(self.falling_bubbles)
