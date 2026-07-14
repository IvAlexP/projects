"""Manages game levels and level transitions."""

import pygame
from config import (
    COMPLETE_LEVEL_TEXT_DURATION,
    MAX_LEVEL,
    START_LEVEL_TEXT_DURATION,
)


class LevelManager:
    """Handles level progression and transition logic."""

    def __init__(self, animation_manager):
        """Initializes the level manager.

        Args:
            animation_manager: The animation manager instance.
        """
        self.animation_manager = animation_manager

        # Level state
        self.current_level = 1
        self.level_completed = False

        # Transition state
        self.transition_phase = 0
        self.transition_timer = 0
        self.bonus_animation_started = False

    def mark_level_completed(self):
        """Marks the current level as completed and starts transition."""
        self.level_completed = True
        self.transition_phase = 1
        self.transition_timer = pygame.time.get_ticks()
        print(f"Level {self.current_level} completed!")

    def handle_transition(self, grid) -> None:
        """Handles the multi-phase level transition sequence.

        Args:
            grid: The game grid.

        Returns:
            bool: True when game state should be reset for new level.
        """
        if self.transition_phase == 1:
            self._handle_completed_message()
        elif self.transition_phase == 2:
            self._handle_bonus_animation(grid)
        elif self.transition_phase == 3:
            self._handle_started_message()

    def _handle_completed_message(self) -> None:
        """Shows level completed message."""
        current_time = pygame.time.get_ticks()
        elapsed = current_time - self.transition_timer
        if elapsed >= COMPLETE_LEVEL_TEXT_DURATION:
            self.transition_phase = 2
            self.bonus_animation_started = False

    def _handle_bonus_animation(self, grid) -> None:
        """Runs the bonus points animation for remaining bubbles.

        Args:
            grid: The game grid.

        Returns:
            bool: True if animation complete and moving to next phase.
        """
        if not self.bonus_animation_started:
            self.animation_manager.initialize_level_completed_bonus(grid)
            self.bonus_animation_started = True

        if self.animation_manager.is_bonus_complete():
            if self.current_level < MAX_LEVEL:
                self.transition_phase = 3
                self.transition_timer = pygame.time.get_ticks()
                self.current_level += 1
                print(f"Level {self.current_level} started!")
            else:
                self.transition_phase = 0

    def _handle_started_message(self) -> None:
        """Shows level started message, then resets for new level.

        Returns:
            bool: True when ready to reset game state.
        """
        current_time = pygame.time.get_ticks()
        if current_time - self.transition_timer >= START_LEVEL_TEXT_DURATION:
            self.level_completed = False
            self.transition_phase = 0
