"""Manages saving and loading game state."""

import pygame
from config import GRID_ROWS, GRID_COLS
from model import Grid
from .game_history_manager import GameHistoryManager
from .level_manager import LevelManager
from .timing_manager import TimingManager
from .scoring_manager import ScoringManager


class GameStateManager:
    """Handles serialization and deserialization of game state."""

    def __init__(self, history_manager: GameHistoryManager):
        """Initializes the game state manager.

        Args:
            history_manager: The history manager for file operations.
        """
        self.history_manager = history_manager
        self.undo_stack = []  # Maximum 3 states for undo
        self.redo_stack = []  # Maximum 3 states for redo

    def save_state(
        self,
        grid,
        level_manager: LevelManager,
        timing_manager: TimingManager,
        scoring_manager: ScoringManager,
        game_over: bool
    ) -> None:
        """Saves the current game state to file.

        Args:
            grid: The game grid.
            level_manager: The level manager.
            timing_manager: The timing manager.
            scoring_manager: The scoring manager.
            game_over: Whether the game is over.
        """
        current_time = pygame.time.get_ticks()

        last_rise_offset = current_time - timing_manager.last_rise_time
        last_spawn_offset = (
            current_time - timing_manager.last_bubble_spawn_time
        )

        grid_data = []
        for row in range(grid.rows):
            row_data = []
            for col in range(grid.cols):
                bubble = grid.get(row, col)
                row_data.append(self.history_manager.serialize_bubble(bubble))
            grid_data.append(row_data)

        game_data = {
            "score": scoring_manager.get_score(),
            "current_level": level_manager.current_level,
            "nr_of_rises": timing_manager.nr_of_rises,
            "game_over": game_over,
            "level_completed": level_manager.level_completed,
            "transition_phase": level_manager.transition_phase,
            "bonus_animation_started": level_manager.bonus_animation_started,
            "last_rise_time_offset": last_rise_offset,
            "last_bubble_spawn_time_offset": last_spawn_offset,
            "grid": grid_data,
        }

        self.history_manager.save_paused_game(game_data)

    def load_state(
        self, animation_manager
    ) -> tuple[Grid, LevelManager, TimingManager, ScoringManager, bool] | None:
        """Loads a paused game state from file.

        Args:
            animation_manager: Animation manager needed for level manager.

        Returns:
            Tuple of (grid, level_manager, timing_manager, scoring_manager,
                game_over) or None if no saved game exists.
        """
        game_data = self.history_manager.load_paused_game()

        if not game_data:
            return None

        grid = Grid(GRID_ROWS, GRID_COLS)
        for row in range(GRID_ROWS):
            for col in range(GRID_COLS):
                bubble_data = game_data["grid"][row][col]
                grid.cells[row][col] = (
                    self.history_manager.deserialize_bubble(bubble_data)
                )

        level_manager = LevelManager(animation_manager)
        level_manager.current_level = game_data["current_level"]
        level_manager.level_completed = game_data["level_completed"]
        level_manager.transition_phase = game_data["transition_phase"]
        level_manager.bonus_animation_started = (
            game_data["bonus_animation_started"]
        )

        timing_manager = TimingManager(level_manager)
        timing_manager.nr_of_rises = game_data["nr_of_rises"]
        timing_manager.next_row_visible = []

        if level_manager.level_completed:
            timing_manager.next_row_full = []

        current_time = pygame.time.get_ticks()
        timing_manager.last_rise_time = (
            current_time - game_data["last_rise_time_offset"]
        )

        bubble_spawn_interval = (
            timing_manager.get_line_rise_interval_for_level() // 12
        )
        timing_manager.last_bubble_spawn_time = (
            current_time - bubble_spawn_interval
        )

        scoring_manager = ScoringManager()
        scoring_manager.score = game_data["score"]

        game_over = game_data["game_over"]

        return (
            grid, level_manager, timing_manager, scoring_manager, game_over
        )

    def create_state_snapshot(
        self, grid,
        level_manager: LevelManager, timing_manager: TimingManager,
        scoring_manager: ScoringManager, game_over: bool
    ) -> dict:
        """Creates a snapshot of the current game state for undo/redo.

        Args:
            grid: The game grid.
            level_manager: The level manager.
            timing_manager: The timing manager.
            scoring_manager: The scoring manager.
            game_over: Whether the game is over.

        Returns:
            A dictionary containing the complete game state.
        """
        current_time = pygame.time.get_ticks()

        last_rise_offset = current_time - timing_manager.last_rise_time
        last_spawn_offset = (
            current_time - timing_manager.last_bubble_spawn_time
        )

        grid_data = []
        for row in range(grid.rows):
            row_data = []
            for col in range(grid.cols):
                bubble = grid.get(row, col)
                row_data.append(self.history_manager.serialize_bubble(bubble))
            grid_data.append(row_data)

        return {
            "score": scoring_manager.get_score(),
            "current_level": level_manager.current_level,
            "nr_of_rises": timing_manager.nr_of_rises,
            "game_over": game_over,
            "level_completed": level_manager.level_completed,
            "transition_phase": level_manager.transition_phase,
            "bonus_animation_started": level_manager.bonus_animation_started,
            "last_rise_time_offset": last_rise_offset,
            "last_bubble_spawn_time_offset": last_spawn_offset,
            "grid": grid_data,
        }

    def restore_state_snapshot(
        self, state_data: dict, animation_manager
    ) -> tuple[Grid, LevelManager, TimingManager, ScoringManager, bool]:
        """Restores game state from a snapshot.

        Args:
            state_data: The state snapshot dictionary.
            animation_manager: Animation manager needed for level manager.

        Returns:
            Tuple of (grid, level_manager, timing_manager, scoring_manager,
                game_over).
        """
        grid = Grid(GRID_ROWS, GRID_COLS)
        for row in range(GRID_ROWS):
            for col in range(GRID_COLS):
                bubble_data = state_data["grid"][row][col]
                grid.cells[row][col] = (
                    self.history_manager.deserialize_bubble(bubble_data)
                )

        level_manager = LevelManager(animation_manager)
        level_manager.current_level = state_data["current_level"]
        level_manager.level_completed = state_data["level_completed"]
        level_manager.transition_phase = state_data["transition_phase"]
        level_manager.bonus_animation_started = (
            state_data["bonus_animation_started"]
        )

        timing_manager = TimingManager(level_manager)
        timing_manager.nr_of_rises = state_data["nr_of_rises"]
        timing_manager.next_row_visible = []

        if level_manager.level_completed:
            timing_manager.next_row_full = []

        current_time = pygame.time.get_ticks()
        timing_manager.last_rise_time = (
            current_time - state_data["last_rise_time_offset"]
        )

        bubble_spawn_interval = (
            timing_manager.get_line_rise_interval_for_level() // 12
        )
        timing_manager.last_bubble_spawn_time = (
            current_time - bubble_spawn_interval
        )

        scoring_manager = ScoringManager()
        scoring_manager.score = state_data["score"]

        game_over = state_data["game_over"]

        return (
            grid, level_manager, timing_manager, scoring_manager, game_over
        )

    def push_undo_state(
        self,
        grid,
        level_manager: LevelManager,
        timing_manager: TimingManager,
        scoring_manager: ScoringManager,
        game_over: bool
    ) -> None:
        """Pushes current state to undo stack (max 3 states).

        Args:
            grid: The game grid.
            level_manager: The level manager.
            timing_manager: The timing manager.
            scoring_manager: The scoring manager.
            game_over: Whether the game is over.
        """
        state = self.create_state_snapshot(
            grid, level_manager, timing_manager, scoring_manager, game_over
        )
        self.undo_stack.append(state)
        if len(self.undo_stack) > 3:
            self.undo_stack.pop(0)

    def pop_undo(
        self, animation_manager, scoring_manager
    ) -> (
        tuple[Grid, LevelManager, TimingManager, ScoringManager, bool, int]
        | None
    ):
        """Pops state from undo stack and applies 20% penalty.

        Args:
            animation_manager: Animation manager for state restoration.
            scoring_manager: Current scoring manager to calculate penalty.

        Returns:
            Tuple of (grid, level_manager, timing_manager, scoring_manager,
                game_over, penalty) or None if stack is empty.
        """
        if not self.undo_stack:
            return None

        # Calculate 20% penalty from current score
        current_score = scoring_manager.get_score()
        penalty = int(current_score * 0.2)

        state = self.undo_stack.pop()
        result = self.restore_state_snapshot(state, animation_manager)

        # Apply penalty to restored state
        (
            grid, level_manager, timing_manager,
            new_scoring_manager, game_over
        ) = result
        new_scoring_manager.score = max(
            0, new_scoring_manager.score - penalty
        )

        return (
            grid, level_manager, timing_manager,
            new_scoring_manager, game_over, penalty
        )

    def pop_redo(
        self, animation_manager
    ) -> tuple[Grid, LevelManager, TimingManager, ScoringManager, bool] | None:
        """Pops state from redo stack (no penalty).

        Args:
            animation_manager: Animation manager for state restoration.

        Returns:
            Tuple of (grid, level_manager, timing_manager, scoring_manager,
                game_over) or None if stack is empty.
        """
        if not self.redo_stack:
            return None

        state = self.redo_stack.pop()
        return self.restore_state_snapshot(state, animation_manager)

    def clear_redo_stack(self) -> None:
        """Clears the redo stack when a new move is made."""
        self.redo_stack.clear()

    def push_to_redo_stack(
        self,
        grid,
        level_manager: LevelManager,
        timing_manager: TimingManager,
        scoring_manager: ScoringManager,
        game_over: bool
    ) -> None:
        """Pushes current state to redo stack (max 3 states).

        Args:
            grid: The game grid.
            level_manager: The level manager.
            timing_manager: The timing manager.
            scoring_manager: The scoring manager.
            game_over: Whether the game is over.
        """
        state = self.create_state_snapshot(
            grid, level_manager, timing_manager, scoring_manager, game_over
        )
        self.redo_stack.append(state)
        if len(self.redo_stack) > 3:
            self.redo_stack.pop(0)

    def has_undo(self) -> bool:
        """Returns True if undo is available."""
        return len(self.undo_stack) > 0

    def has_redo(self) -> bool:
        """Returns True if redo is available."""
        return len(self.redo_stack) > 0

    def clear_all_stacks(self) -> None:
        """Clears both undo and redo stacks."""
        self.undo_stack.clear()
        self.redo_stack.clear()
