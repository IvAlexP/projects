"""Manages UI rendering (facade for UI components)."""

import pygame
from .ui import (
    MainMenuRenderer,
    PauseMenuRenderer,
    HistoryRenderer,
    HUDRenderer,
    MessageRenderer,
    SettingsRenderer,
)


class UIManager:
    """Facade that coordinates all UI rendering components."""

    def __init__(self, screen: pygame.Surface):
        """Initializes the UI manager.

        Args:
            screen: The pygame screen surface.
        """
        self.screen = screen
        self.main_menu_renderer = MainMenuRenderer(screen)
        self.pause_menu_renderer = PauseMenuRenderer(screen)
        self.history_renderer = HistoryRenderer(screen)
        self.hud_renderer = HUDRenderer(screen)
        self.message_renderer = MessageRenderer(screen)
        self.settings_renderer = SettingsRenderer(screen)

    def draw_main_menu(self, has_paused_game: bool = False) -> None:
        """Draws the main menu.

        Args:
            has_paused_game: Whether a paused game exists.
        """
        mouse_pos = pygame.mouse.get_pos()
        self.main_menu_renderer.draw(
            mouse_pos,
            has_paused_game
        )

    def draw_history_screen(self, games: list[dict], statistics: dict) -> None:
        """Draws the game history screen.

        Args:
            games: List of game entries.
            statistics: Dictionary with best_score, total_games, average_score.
        """
        mouse_pos = pygame.mouse.get_pos()
        self.history_renderer.draw(
            games, statistics, mouse_pos
        )

    def draw_settings_screen(self) -> None:
        """Draws the settings screen."""
        mouse_pos = pygame.mouse.get_pos()
        self.settings_renderer.draw(
            mouse_pos
        )

    def draw_pause_screen(self) -> None:
        """Draws the pause menu overlay."""
        mouse_pos = pygame.mouse.get_pos()
        self.pause_menu_renderer.draw(mouse_pos)

    def draw_all(
        self, score: int, nr_of_rises: int, max_rises: int,
        game_over: bool, current_level: int, transition_phase: int,
        has_undo: bool = False, has_redo: bool = False,
        show_undo_message: bool = False, undo_penalty: int = 0
    ) -> None:
        """Draws all UI elements during gameplay.

        Args:
            score: Current score.
            nr_of_rises: Number of rises that have occurred.
            max_rises: Maximum rises allowed for current level.
            game_over: Whether game is over.
            current_level: Current level number.
            transition_phase: Current phase of level transition.
            has_undo: Whether undo is available.
            has_redo: Whether redo is available.
            show_undo_message: Whether to show undo penalty message.
            undo_penalty: The penalty amount to display.
        """
        self.hud_renderer.draw(score, nr_of_rises, max_rises, current_level)

        if not game_over and transition_phase == 0:
            mouse_pos = pygame.mouse.get_pos()
            self.hud_renderer.draw_pause_button(mouse_pos)
            self.hud_renderer.draw_undo_redo_buttons(
                has_undo, has_redo, mouse_pos
            )

        if game_over:
            mouse_pos = pygame.mouse.get_pos()
            self.message_renderer.draw_game_over(mouse_pos)
        elif show_undo_message:
            self.message_renderer.draw_undo_penalty(undo_penalty)
        elif transition_phase == 1:
            self.message_renderer.draw_level_completed(current_level)
        elif transition_phase == 3:
            self.message_renderer.draw_level_started(current_level)
