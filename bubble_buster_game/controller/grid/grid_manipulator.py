"""Handles grid manipulation operations like shifting, popping, and gravity."""

from model import Grid, Bubble


class GridManipulator:
    """Manages grid modifications and transformations."""

    @staticmethod
    def shift_grid_up(
        grid: Grid, new_row: list[Bubble], nr_of_rises: int, max_rises: int
    ) -> bool:
        """Shifts all rows up by one and adds a new row at the bottom.

        Args:
            grid (Grid): The game board.
            new_row (list[Bubble]): The new row of bubbles to add.
            nr_of_rises (int): Current number of rises.
            max_rises (int): Maximum number of rises allowed for current level.

        Returns:
            bool: False if the top row has bubbles (next level)
        """
        for col in range(grid.cols):
            if grid.get(0, col) is not None:
                return False

        if nr_of_rises >= max_rises:
            return False

        # Shift all rows up
        for row in range(grid.rows - 1):
            for col in range(grid.cols):
                bubble = grid.get(row + 1, col)
                grid.set(row, col, bubble)

        # Add new row at the bottom
        bottom_row = grid.rows - 1
        for col, bubble in enumerate(new_row):
            grid.set(bottom_row, col, bubble)

        return True

    @staticmethod
    def pop_group(grid: Grid, group: set[tuple[int, int]]) -> None:
        """Removes a group of bubbles from the grid.

        Args:
            grid (Grid): The game board.
            group (set[tuple[int, int]]): Coordinates of the connected group.
        """
        for row, col in group:
            grid.set(row, col, None)

    @staticmethod
    def apply_gravity(grid: Grid) -> dict[tuple[int, int], tuple[int, int]]:
        """Applies gravity to the grid, making bubbles fall down.

        Args:
            grid (Grid): The game board.

        Returns:
            dict[tuple[int, int], tuple[int, int]]: mapping changed coordinates
        """
        moves = {}

        for col in range(grid.cols):
            write_row = grid.rows - 1
            for read_row in range(grid.rows - 1, -1, -1):
                bubble = grid.get(read_row, col)
                if bubble is not None:
                    if read_row != write_row:
                        moves[(read_row, col)] = (write_row, col)
                        grid.set(write_row, col, bubble)
                        grid.set(read_row, col, None)
                    write_row -= 1

        return moves
