"""This module contains the main game loop and logic."""

import pygame
import sys
from config import (
    WINDOW_WIDTH,
    WINDOW_HEIGHT,
    GRID_ROWS,
    GRID_COLS,
    INITIAL_ROWS,
    FPS,
)
from model import GameState
from view import (
    GameElementsRenderer,
    AnimationManager,
    UIManager,
    GameStateRenderer,
)
from .grid import GridGenerator, GridManipulator
from .managers import (
    LevelManager, TimingManager, ScoringManager,
    InputHandler, GameHistoryManager, GameStateManager, ThemeManager
)


class Game:
    """The game class with the main loop and game logic."""

    def __init__(self) -> None:
        """Initializes the game, Pygame, and sets up the grid and renderer."""
        pygame.init()
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption("BubbleBuster")
        self.clock = pygame.time.Clock()

        self.game_state: GameState = GameState.MENU
        self.grid = GridGenerator.generate_initial_grid(
            GRID_ROWS, GRID_COLS, INITIAL_ROWS
        )
        self.renderer = GameElementsRenderer(self.screen)
        self.animation_manager = AnimationManager(self.renderer, self.screen)
        self.ui_manager = UIManager(self.screen)
        self.level_manager = LevelManager(self.animation_manager)
        self.timing_manager = TimingManager(self.level_manager)
        self.scoring_manager = ScoringManager()
        self.history_manager = GameHistoryManager()
        self.game_state_manager = GameStateManager(self.history_manager)
        self.input_handler = InputHandler(
            self.renderer, self.animation_manager,
            self.ui_manager, self.game_state_manager
        )
        self.game_state_renderer = GameStateRenderer(
            self.screen, self.renderer, self.ui_manager,
            self.animation_manager, self.history_manager
        )

        self.running = True
        self.game_over = False
        self.pause_timestamp = None
        self.undo_message_timer = None
        self.undo_penalty_amount = 0

    def start_new_game(self, delete_paused: bool = True) -> None:
        """Starts a new game by resetting all game state.

        Args:
            delete_paused: Whether to delete paused game save.
        """
        if delete_paused:
            self.history_manager.delete_paused_game()

        self.game_state = GameState.PLAYING
        self.grid = GridGenerator.generate_initial_grid(
            GRID_ROWS, GRID_COLS, INITIAL_ROWS
        )
        self.level_manager = LevelManager(self.animation_manager)
        self.timing_manager = TimingManager(self.level_manager)
        self.scoring_manager = ScoringManager()
        self.game_over = False
        self.pause_timestamp = None
        self.game_state_manager.clear_all_stacks()
        self.undo_message_timer = None
        self.undo_penalty_amount = 0

    def handle_events(self) -> None:
        """Processes Pygame events."""
        new_state = self.input_handler.process_events(
            self.game_state, self.grid, self.game_over,
            self.level_manager.level_completed,
            self.animation_manager, self.scoring_manager
        )

        if new_state == "GRID_CLICK":
            self.game_state_manager.push_undo_state(
                self.grid, self.level_manager, self.timing_manager,
                self.scoring_manager, self.game_over
            )
            self.game_state_manager.clear_redo_stack()
            self.input_handler.handle_click_playing(
                self.grid, self.scoring_manager
            )
            return

        if new_state == GameState.QUIT:
            self.running = False
        elif new_state == "RESUME":
            self.resume_game()
        elif new_state == "SAVE_AND_QUIT":
            self.pause_game()
            self.game_state = GameState.MENU
        elif new_state == "NEW_GAME":
            self.start_new_game()
        elif new_state == "QUIT":
            self.game_state = GameState.MENU
        elif new_state == "PLAY_AGAIN":
            self.start_new_game()
        elif new_state == "MENU":
            self.game_state = GameState.MENU
        elif new_state == "DARK_MODE":
            ThemeManager.apply_theme("dark")
        elif new_state == "LIGHT_MODE":
            ThemeManager.apply_theme("light")
        elif new_state == "BASIC_MODE":
            ThemeManager.apply_theme("basic")
        elif new_state == "UNDO":
            self.handle_undo()
        elif new_state == "REDO":
            self.handle_redo()
        elif new_state == GameState.PLAYING:
            if self.game_state == GameState.PAUSED:
                self.resume_from_pause()
            else:
                self.start_new_game()
        elif new_state == GameState.PAUSED:
            self.pause_timestamp = pygame.time.get_ticks()
            self.game_state = GameState.PAUSED
        elif isinstance(new_state, GameState):
            self.game_state = new_state

    def update_animations(self) -> None:
        """Updates all animations."""
        self.animation_manager.draw_and_update_popping(self.grid)

        if not self.animation_manager.fall_animator.is_animating():
            moves = GridManipulator.apply_gravity(self.grid)
            if moves:
                self.animation_manager.start_falling_animations(
                    moves, self.grid
                )

        self.animation_manager.draw_and_update_falling()

    def update_timing(self) -> None:
        """Updates timing-related mechanics (preview row and line rise)."""
        self.timing_manager.update_preview_row()

        if not self.animation_manager.has_active_animations():
            success = self.timing_manager.update_line_rise(
                self.grid, self.game_over, self.level_manager.level_completed
            )
            if not success:
                self.level_manager.mark_level_completed()

    def reset_for_new_level(self) -> None:
        """Resets the game state for a new level."""
        self.grid = GridGenerator.generate_initial_grid(
            GRID_ROWS, GRID_COLS, INITIAL_ROWS
        )
        self.timing_manager.reset_for_new_level()

    def handle_level_transitions(self) -> None:
        """Handles level transition logic and state updates."""
        if not self.level_manager.level_completed:
            return

        self.level_manager.handle_transition(self.grid)

        if not self.level_manager.level_completed:
            self.reset_for_new_level()
        elif self.level_manager.transition_phase == 0 and not self.game_over:
            self.game_over = True
            final_score = self.scoring_manager.get_score()
            final_level = self.level_manager.current_level
            print(f"Game over! Final Score: {final_score}")

            self.history_manager.delete_paused_game()

            self.history_manager.save_game(final_score, final_level)

    def pause_game(self) -> None:
        """Saves the current game state to file."""
        self.game_state_manager.save_state(
            self.grid,
            self.level_manager,
            self.timing_manager,
            self.scoring_manager,
            self.game_over
        )

    def resume_game(self) -> None:
        """Loads a paused game state from file."""
        result = self.game_state_manager.load_state(self.animation_manager)

        if not result:
            return

        (
            self.grid,
            self.level_manager,
            self.timing_manager,
            self.scoring_manager,
            self.game_over
        ) = result

        self.animation_manager.clear_all_animations()

        self.game_state = GameState.PLAYING
        self.pause_timestamp = None

    def resume_from_pause(self) -> None:
        """Adjusts timers when resuming from pause menu."""
        if self.pause_timestamp:
            current_time = pygame.time.get_ticks()
            pause_duration = current_time - self.pause_timestamp

            self.timing_manager.last_rise_time += pause_duration
            self.timing_manager.last_bubble_spawn_time += pause_duration
            if self.level_manager.transition_timer:
                self.level_manager.transition_timer += pause_duration

            self.pause_timestamp = None

        self.game_state = GameState.PLAYING

    def handle_undo(self) -> None:
        """Handles undo action by restoring previous state with penalty."""
        if not self.animation_manager.has_active_animations():
            self.game_state_manager.push_to_redo_stack(
                self.grid, self.level_manager, self.timing_manager,
                self.scoring_manager, self.game_over
            )

            result = self.game_state_manager.pop_undo(
                self.animation_manager, self.scoring_manager
            )

            if result:
                (
                    self.grid,
                    self.level_manager,
                    self.timing_manager,
                    self.scoring_manager,
                    self.game_over,
                    penalty
                ) = result

                self.animation_manager.clear_all_animations()
                self.undo_message_timer = pygame.time.get_ticks()
                self.undo_penalty_amount = penalty
                print(
                    f"Undo applied! Penalty: -{penalty} points. "
                    f"Score: {self.scoring_manager.get_score()}"
                )

    def handle_redo(self) -> None:
        """Handles redo action by restoring next state (no penalty)."""
        if not self.animation_manager.has_active_animations():
            self.game_state_manager.push_undo_state(
                self.grid, self.level_manager, self.timing_manager,
                self.scoring_manager, self.game_over
            )

            result = self.game_state_manager.pop_redo(self.animation_manager)

            if result:
                (
                    self.grid,
                    self.level_manager,
                    self.timing_manager,
                    self.scoring_manager,
                    self.game_over
                ) = result

                self.animation_manager.clear_all_animations()
                print(
                    f"Redo applied! "
                    f"Score: {self.scoring_manager.get_score()}"
                )

    def render(self) -> None:
        """Renders the current game state."""
        show_undo_message = False
        if self.undo_message_timer:
            current_time = pygame.time.get_ticks()
            if current_time - self.undo_message_timer < 1000:
                show_undo_message = True
            else:
                self.undo_message_timer = None

        self.game_state_renderer.render(
            self.game_state, self.grid, self.game_over,
            self.level_manager, self.timing_manager,
            self.scoring_manager, self.animation_manager,
            self.input_handler.hovered_cell,
            self.game_state_manager.has_undo(),
            self.game_state_manager.has_redo(),
            show_undo_message,
            self.undo_penalty_amount
        )

    def run(self) -> None:
        """Runs the main game loop."""
        while self.running:
            self.handle_events()
            if self.game_state == GameState.PLAYING:
                self.update_animations()
                self.update_timing()
                self.handle_level_transitions()
            self.render()
            self.clock.tick(FPS)
        pygame.quit()
        sys.exit()
