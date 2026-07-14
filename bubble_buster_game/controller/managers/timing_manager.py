"""Manages timing, line rise mechanics, and preview row animations."""

import pygame
from config import (
    GRID_COLS,
    MAX_RISES_BASE,
    MAX_RISES_INCREASE_PER_LEVEL,
    LINE_RISE_BASE_INTERVAL,
    LINE_RISE_DECREASE_PER_LEVEL,
    MIN_LINE_RISE_INTERVAL,
)
from ..grid import GridGenerator, GridManipulator


class TimingManager:
    """Handles all timing-related game mechanics (line rise, preview)."""

    def __init__(self, level_manager) -> None:
        """Initializes the timing manager.

        Args:
            level_manager: The level manager to get current level info.
        """
        self.level_manager = level_manager
        self.nr_of_rises = 0
        self.last_rise_time = pygame.time.get_ticks()
        self.next_row_full = GridGenerator.generate_new_row(GRID_COLS)
        self.next_row_visible = []
        self.last_bubble_spawn_time = pygame.time.get_ticks()

    def get_max_rises_for_level(self) -> int:
        """Calculates the maximum number of rises for the current level.

        Returns:
            int: Maximum rises for current level
        """
        return (
            MAX_RISES_BASE
            + (self.level_manager.current_level - 1)
            * MAX_RISES_INCREASE_PER_LEVEL
        )

    def get_line_rise_interval_for_level(self) -> int:
        """Calculates the line rise interval for the current level.

        Returns:
            int: Interval which decreases each level.
        """
        interval = (
            LINE_RISE_BASE_INTERVAL
            - (self.level_manager.current_level - 1)
            * LINE_RISE_DECREASE_PER_LEVEL
        )
        return max(interval, MIN_LINE_RISE_INTERVAL)

    def update_preview_row(self) -> None:
        """Updates the preview row by adding one bubble at a time."""
        if len(self.next_row_visible) >= GRID_COLS:
            return

        current_time = pygame.time.get_ticks()
        bubble_spawn_interval = (
            self.get_line_rise_interval_for_level() // GRID_COLS
        )
        if current_time - self.last_bubble_spawn_time >= bubble_spawn_interval:
            next_index = len(self.next_row_visible)
            self.next_row_visible.append(self.next_row_full[next_index])
            self.last_bubble_spawn_time = current_time

    def update_line_rise(
        self, grid, game_over: bool, level_completed: bool
    ) -> bool:
        """Checks if it's time to rise the lines and adds a new row.

        Args:
            grid: The game grid.
            game_over (bool): Whether the game is over.
            level_completed (bool): Whether the level is completed.

        Returns:
            bool: False if the level should be marked completed.
        """
        if game_over or level_completed:
            return True

        current_time = pygame.time.get_ticks()
        line_rise_interval = self.get_line_rise_interval_for_level()

        if current_time - self.last_rise_time >= line_rise_interval:
            # Ensure preview row is fully displayed before adding
            # (for after the resume when preview resets)
            if len(self.next_row_visible) < GRID_COLS:
                return True

            max_rises = self.get_max_rises_for_level()
            success = GridManipulator.shift_grid_up(
                grid, self.next_row_full, self.nr_of_rises, max_rises
            )
            if not success:
                return False  # Signal level completion
            else:
                self.next_row_full = GridGenerator.generate_new_row(GRID_COLS)
                self.next_row_visible = []
                self.last_bubble_spawn_time = current_time
                self.last_rise_time = current_time
                self.nr_of_rises += 1
                print("New row added")

        return True

    def reset_for_new_level(self) -> None:
        """Resets timing state for a new level."""
        self.next_row_full = GridGenerator.generate_new_row(GRID_COLS)
        self.next_row_visible = []
        self.nr_of_rises = 0
        self.last_rise_time = pygame.time.get_ticks()
        self.last_bubble_spawn_time = pygame.time.get_ticks()
