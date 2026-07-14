"""Handles user input and interaction with the game."""

import pygame
from model import GameState
from ..grid import BubbleMatchingEngine, GridManipulator


class InputHandler:
    """Manages all user input and bubble interaction logic."""

    def __init__(
        self, renderer, animation_manager, ui_manager, game_state_manager
    ) -> None:
        """Initializes the input handler.

        Args:
            renderer: The renderer to convert mouse position to coordinates.
            animation_manager: The animation manager for bubble animations.
            ui_manager: The UI manager containing all renderers.
            game_state_manager: The game state manager for undo/redo.
        """
        self.renderer = renderer
        self.animation_manager = animation_manager
        self.ui_manager = ui_manager
        self.game_state_manager = game_state_manager
        self.hovered_cell = None

    def process_events(
        self, game_state: GameState, grid=None,
        game_over: bool = False, level_completed: bool = False,
        animation_manager=None, scoring_manager=None
    ) -> GameState | str | None:
        """Processes Pygame events and handles interactions.

        Args:
            game_state: Current game state.
            grid: The game grid (None if not playing).
            game_over (bool): Whether the game is over.
            level_completed (bool): Whether the level is completed.
            animation_manager: Animation manager to check for active
                animations.
            scoring_manager: The scoring manager to update scores.

        Returns:
            GameState | str | None: New state if changed, special string
                signals for buttons or None otherwise.
        """
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return GameState.QUIT

            result = None
            if game_state == GameState.MENU:
                result = self._handle_menu_events(event)
            elif game_state == GameState.HISTORY:
                result = self._handle_history_events(event)
            elif game_state == GameState.SETTINGS:
                result = self._handle_settings_events(event)
            elif game_state == GameState.PAUSED:
                result = self._handle_paused_events(event)
            elif game_state == GameState.PLAYING:
                result = self._handle_playing_events(
                    event, grid, game_over, level_completed, animation_manager,
                    scoring_manager
                )

            if result:
                return result

        return None

    def _handle_menu_events(
        self, event: pygame.event.Event
    ) -> GameState | str | None:
        """Handles events when in MENU state.

        Args:
            event: The pygame event to process.

        Returns:
            GameState | str | None: New state or special signal.
        """
        from .game_history_manager import GameHistoryManager
        history_mgr = GameHistoryManager()
        has_paused_game = history_mgr.has_paused_game()

        if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            if self.ui_manager.main_menu_renderer.is_start_button_clicked(event.pos):
                return GameState.PLAYING
            elif self.ui_manager.main_menu_renderer.is_history_button_clicked(event.pos):
                return GameState.HISTORY
            elif self.ui_manager.main_menu_renderer.is_settings_button_clicked(event.pos):
                return GameState.SETTINGS
            elif self.ui_manager.main_menu_renderer.is_resume_button_clicked(
                event.pos, has_paused_game
            ):
                return "RESUME"
        return None

    def _handle_history_events(
        self, event: pygame.event.Event
    ) -> GameState | None:
        """Handles events when in HISTORY state.

        Args:
            event: The pygame event to process.

        Returns:
            GameState | None: New state if changed.
        """
        if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            if self.ui_manager.history_renderer.is_back_button_clicked(event.pos):
                return GameState.MENU
        return None

    def _handle_settings_events(
        self, event: pygame.event.Event
    ) -> GameState | str | None:
        """Handles events when in SETTINGS state.

        Args:
            event: The pygame event to process.

        Returns:
            GameState | str | None: New state or theme change signal.
        """
        if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            if self.ui_manager.settings_renderer.is_back_button_clicked(event.pos):
                return GameState.MENU
            elif self.ui_manager.settings_renderer.is_dark_mode_button_clicked(event.pos):
                return "DARK_MODE"
            elif self.ui_manager.settings_renderer.is_light_mode_button_clicked(event.pos):
                return "LIGHT_MODE"
            elif self.ui_manager.settings_renderer.is_basic_mode_button_clicked(event.pos):
                return "BASIC_MODE"
        return None

    def _handle_paused_events(
        self, event: pygame.event.Event
    ) -> GameState | str | None:
        """Handles events when in PAUSED state.

        Args:
            event: The pygame event to process.

        Returns:
            GameState | str | None: New state or special signal.
        """
        if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            if self.ui_manager.pause_menu_renderer.is_resume_button_clicked(event.pos):
                return GameState.PLAYING
            elif self.ui_manager.pause_menu_renderer.is_save_and_quit_button_clicked(
                event.pos
            ):
                return "SAVE_AND_QUIT"
            elif self.ui_manager.pause_menu_renderer.is_new_game_button_clicked(
                event.pos
            ):
                return "NEW_GAME"
            elif self.ui_manager.pause_menu_renderer.is_quit_button_clicked(event.pos):
                return "QUIT"
        elif event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
            return GameState.PLAYING
        return None

    def _handle_playing_events(
        self, event: pygame.event.Event, grid, game_over: bool,
        level_completed: bool, animation_manager, scoring_manager
    ) -> GameState | str | None:
        """Handles events when in PLAYING state.

        Args:
            event: The pygame event to process.
            grid: The game grid.
            game_over: Whether the game is over.
            level_completed: Whether the level is completed.
            animation_manager: Animation manager to check animations.
            scoring_manager: The scoring manager to update scores.

        Returns:
            GameState | str | None: New state or special signal.
        """
        if (game_over and event.type == pygame.MOUSEBUTTONDOWN
                and event.button == 1):
            if self.ui_manager.message_renderer.is_play_again_clicked(event.pos):
                return "PLAY_AGAIN"
            elif self.ui_manager.message_renderer.is_menu_clicked(event.pos):
                return "MENU"

        if event.type == pygame.MOUSEMOTION:
            self.hovered_cell = self.renderer.get_cell_from_mouse(event.pos)
        elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            is_pause_clicked = self.ui_manager.hud_renderer.is_pause_button_clicked(
                event.pos
            )
            is_undo_clicked = self.ui_manager.hud_renderer.is_undo_clicked(event.pos)
            is_redo_clicked = self.ui_manager.hud_renderer.is_redo_clicked(event.pos)

            if is_pause_clicked:
                if (animation_manager and
                        not animation_manager.has_active_animations()):
                    return GameState.PAUSED
            elif is_undo_clicked and self.game_state_manager.has_undo():
                if (animation_manager and
                        not animation_manager.has_active_animations()):
                    return "UNDO"
            elif is_redo_clicked and self.game_state_manager.has_redo():
                if (animation_manager and
                        not animation_manager.has_active_animations()):
                    return "REDO"
            elif not game_over and not level_completed and self.hovered_cell:
                return "GRID_CLICK"
        return None

    def handle_click_playing(self, grid, scoring_manager) -> None:
        """Handles clicking on the hovered cell if valid.

        Args:
            grid: The game grid.
            scoring_manager: The scoring manager to update scores.
        """
        if not self.hovered_cell:
            return

        row, col = self.hovered_cell
        bubble = grid.get(row, col)

        if not bubble:
            return

        if bubble.is_bomb():
            affected_positions = BubbleMatchingEngine.find_bomb_targets(
                grid, row, col
            )
            self._pop_bubbles(
                grid, affected_positions, "Bomb exploded!", scoring_manager
            )
        elif bubble.is_row_bomb():
            affected_positions = BubbleMatchingEngine.find_row_bomb_targets(
                grid, row
            )
            self._pop_bubbles(
                grid, affected_positions, "Row bomb exploded!", scoring_manager
            )
        elif bubble.is_column_bomb():
            affected_positions = BubbleMatchingEngine.find_column_bomb_targets(
                grid, col
            )
            self._pop_bubbles(
                grid, affected_positions, "Column bomb exploded!",
                scoring_manager
            )
        else:
            group = BubbleMatchingEngine.find_connected_group(grid, row, col)
            if len(group) >= 3:
                self._pop_bubbles(
                    grid, group, "Group popped!", scoring_manager
                )

    def _add_pop_animations(
        self, grid, positions: set[tuple[int, int]]
    ) -> None:
        """Adds popping animations for all bubbles at given positions.

        Args:
            grid: The game grid.
            positions (set[tuple[int, int]]): Set of (row, col) coordinates.
        """
        for r, c in positions:
            bubble = grid.get(r, c)
            if bubble:
                self.animation_manager.add_popping_bubble(
                    r, c, bubble.get_color()
                )

    def _pop_bubbles(
        self, grid, positions: set[tuple[int, int]], bubble_type_name: str,
        scoring_manager
    ) -> None:
        """Pops bubbles, adds animations, updates score, and logs the action.

        Args:
            grid: The game grid.
            positions (set[tuple[int, int]]): Set of coordinates to pop.
            bubble_type_name (str): Name of the bubble type for logging.
            scoring_manager: The scoring manager to update scores.
        """
        if not positions:
            return

        self._add_pop_animations(grid, positions)
        GridManipulator.pop_group(grid, positions)
        scoring_manager.add_bubble_pop_score(len(positions))
        print(
            f"{bubble_type_name} Popped {len(positions)} bubbles! "
            f"Score: {scoring_manager.get_score()}"
        )
