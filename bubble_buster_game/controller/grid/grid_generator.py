"""Handles generation of bubbles and grid initialization."""

import random
from model import Grid, Bubble, Color, BubbleType
from config import (
    BOMB_SPAWN_CHANCE,
    ROW_BOMB_SPAWN_CHANCE,
    COLUMN_BOMB_SPAWN_CHANCE,
)


class GridGenerator:
    """Generates grids and random bubbles for the game."""

    @staticmethod
    def get_random_bubble_type() -> BubbleType:
        """Selects a random bubble type based on probabilities.

        Returns:
            BubbleType: The selected bubble type.
        """
        rand = random.random()

        if rand < BOMB_SPAWN_CHANCE:
            return BubbleType.BOMB
        elif rand < ROW_BOMB_SPAWN_CHANCE:
            return BubbleType.ROW_BOMB
        elif rand < COLUMN_BOMB_SPAWN_CHANCE:
            return BubbleType.COLUMN_BOMB
        else:
            return BubbleType.NORMAL

    @staticmethod
    def generate_initial_grid(
        rows: int, cols: int, filled_rows: int = 4
    ) -> Grid:
        """Generates a grid with the bottom rows filled with random bubbles.

        Args:
            rows (int): Total number of rows in the grid.
            cols (int): Number of columns.
            filled_rows (int): Number of bottom rows to fill with bubbles.

        Returns:
            Grid: A Grid object with bubbles only in the bottom rows.
        """
        grid = Grid(rows, cols)
        color_list = list(Color)

        start_row = rows - filled_rows
        for r in range(start_row, rows):
            for c in range(cols):
                bubble = Bubble(
                    random.choice(color_list),
                    GridGenerator.get_random_bubble_type()
                )
                grid.set(r, c, bubble)
        return grid

    @staticmethod
    def generate_new_row(cols: int) -> list[Bubble]:
        """Generates a new row of random bubbles.

        Args:
            cols (int): Number of columns (bubbles in the row).

        Returns:
            list[Bubble]: A list of Bubble objects.
        """
        color_list = list(Color)
        new_row = []

        for _ in range(cols):
            bubble = Bubble(
                random.choice(color_list),
                GridGenerator.get_random_bubble_type()
            )
            new_row.append(bubble)

        return new_row
