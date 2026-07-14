"""Manages all different game states."""

import pygame
import config
from model import GameState
from controller.managers import ScoringManager


class GameStateRenderer:
    """Coordinates rendering of all game states."""

    def __init__(
        self, screen: pygame.Surface, renderer, ui_manager,
        animation_manager, history_manager
    ):
        """Initializes the game renderer.

        Args:
            screen: Pygame screen surface.
            renderer: Game elements renderer.
            ui_manager: UI elements manager.
            animation_manager: Animation manager.
            history_manager: Game history manager.
        """
        self.screen = screen
        self.renderer = renderer
        self.ui_manager = ui_manager
        self.animation_manager = animation_manager
        self.history_manager = history_manager

    def render_menu(self) -> None:
        """Renders the main menu screen."""
        has_paused_game = self.history_manager.has_paused_game()
        self.ui_manager.draw_main_menu(has_paused_game)
        pygame.display.flip()

    def render_history(self) -> None:
        """Renders the game history screen."""
        games = self.history_manager.get_all_games()
        statistics = self.history_manager.get_statistics()
        self.ui_manager.draw_history_screen(games, statistics)
        pygame.display.flip()

    def render_settings(self) -> None:
        """Renders the settings screen."""
        self.ui_manager.draw_settings_screen()
        pygame.display.flip()

    def render_game_grid(
        self, grid, game_over: bool, level_completed: bool,
        next_row_visible, hovered_cell: tuple[int, int] | None
    ) -> None:
        """Renders the game grid, preview row, and hover effect.

        Args:
            grid: The game grid.
            game_over: Whether the game is over.
            level_completed: Whether the level is completed.
            next_row_visible: Preview row bubbles.
            hovered_cell: The hovered cell coordinates or None.
        """
        falling_destinations = (
            self.animation_manager.get_falling_destinations()
        )
        self.renderer.draw_grid(grid, exclude_positions=falling_destinations)

        if not game_over:
            self.renderer.draw_preview_row(next_row_visible)

        if not game_over and not level_completed:
            self.renderer.draw_hover_effect_on_cell(grid, hovered_cell)

    def render_bonus_effects(
        self, grid, level_manager, scoring_manager
    ) -> None:
        """Renders level completion bonus effects and updates score.

        Args:
            grid: The game grid.
            level_manager: Level manager instance.
            scoring_manager: Scoring manager instance.
        """
        is_bonus_active = (
            level_manager.level_completed
            and level_manager.transition_phase == 2
        )
        points_earned = self.animation_manager.update_level_completed_bonus(
            grid,
            is_bonus_active,
            ScoringManager.points_per_empty_cell(level_manager.current_level),
        )
        scoring_manager.add_bonus_score(points_earned)
        self.animation_manager.draw_bonus_text(
            ScoringManager.points_per_empty_cell(level_manager.current_level)
        )

    def render_hud(
        self, scoring_manager, timing_manager, level_manager, game_over: bool,
        has_undo: bool = False, has_redo: bool = False,
        show_undo_message: bool = False, undo_penalty: int = 0
    ) -> None:
        """Renders the heads-up display (score, level, etc.).

        Args:
            scoring_manager: Scoring manager instance.
            timing_manager: Timing manager instance.
            level_manager: Level manager instance.
            game_over: Whether the game is over.
            has_undo: Whether undo is available.
            has_redo: Whether redo is available.
            show_undo_message: Whether to show undo penalty message.
            undo_penalty: The penalty amount to display.
        """
        max_rises = timing_manager.get_max_rises_for_level()
        self.ui_manager.draw_all(
            scoring_manager.get_score(),
            timing_manager.nr_of_rises,
            max_rises,
            game_over,
            level_manager.current_level,
            level_manager.transition_phase,
            has_undo,
            has_redo,
            show_undo_message,
            undo_penalty
        )

    def render_playing(
        self, grid, game_over, level_manager, timing_manager,
        scoring_manager, animation_manager, hovered_cell,
        has_undo: bool = False, has_redo: bool = False,
        show_undo_message: bool = False, undo_penalty: int = 0
    ) -> None:
        """Renders the playing game state.

        Args:
            grid: The game grid.
            game_over: Whether the game is over.
            level_manager: Level manager instance.
            timing_manager: Timing manager instance.
            scoring_manager: Scoring manager instance.
            animation_manager: Animation manager instance.
            hovered_cell: The hovered cell coordinates or None.
            has_undo: Whether undo is available.
            has_redo: Whether redo is available.
            show_undo_message: Whether to show undo penalty message.
            undo_penalty: The penalty amount to display.
        """
        self.render_game_grid(
            grid, game_over, level_manager.level_completed,
            timing_manager.next_row_visible, hovered_cell
        )
        animation_manager.draw_and_update_popping(grid)
        animation_manager.draw_and_update_falling()
        self.render_bonus_effects(grid, level_manager, scoring_manager)
        self.render_hud(
            scoring_manager, timing_manager, level_manager, game_over,
            has_undo, has_redo, show_undo_message, undo_penalty
        )
        pygame.display.flip()

    def render(
        self, game_state: GameState, grid=None, game_over=False,
        level_manager=None, timing_manager=None,
        scoring_manager=None, animation_manager=None, hovered_cell=None,
        has_undo: bool = False, has_redo: bool = False,
        show_undo_message: bool = False, undo_penalty: int = 0
    ) -> None:
        """Renders the current game state.

        Args:
            game_state: Current game state.
            grid: The game grid.
            game_over: Whether game is over.
            level_manager: Level manager.
            timing_manager: Timing manager.
            scoring_manager: Scoring manager.
            animation_manager: Animation manager.
            hovered_cell: The hovered cell coordinates or None.
            has_undo: Whether undo is available.
            has_redo: Whether redo is available.
            show_undo_message: Whether to show undo penalty message.
            undo_penalty: The penalty amount to display.
        """
        self.screen.fill(config.BG_COLOR)

        if game_state == GameState.MENU:
            self.render_menu()
        elif game_state == GameState.HISTORY:
            self.render_history()
        elif game_state == GameState.SETTINGS:
            self.render_settings()
        elif game_state == GameState.PAUSED:
            self.render_paused(
                grid, game_over, level_manager, timing_manager,
                scoring_manager, animation_manager, hovered_cell
            )
        else:  # GameState.PLAYING
            self.render_playing(
                grid, game_over, level_manager, timing_manager,
                scoring_manager, animation_manager, hovered_cell,
                has_undo, has_redo, show_undo_message, undo_penalty
            )

    def render_paused(
        self, grid, game_over, level_manager, timing_manager,
        scoring_manager, animation_manager, hovered_cell
    ) -> None:
        """Renders the paused game state (frozen game with pause menu overlay).

        Args:
            grid: The game grid.
            game_over: Whether the game is over.
            level_manager: Level manager instance.
            timing_manager: Timing manager instance.
            scoring_manager: Scoring manager instance.
            animation_manager: Animation manager instance.
            hovered_cell: The hovered cell coordinates or None.
        """
        self.render_game_grid(
            grid, game_over, level_manager.level_completed,
            timing_manager.next_row_visible, hovered_cell
        )
        self.render_hud(
            scoring_manager, timing_manager, level_manager, game_over
        )

        self.ui_manager.draw_pause_screen()
        pygame.display.flip()
