"""Defines the Grid class for managing the game board."""

from .bubble import Bubble


class Grid:
    """Represents the game board as a 2D grid.

    The grid stores Bubble objects or None in each cell and provides
    safe access methods and adjacency detection.
    """

    def __init__(self, rows: int, cols: int) -> None:
        """Initializes an empty grid.

        Args:
            rows (int): Number of rows.
            cols (int): Number of columns.
        """
        self.rows = rows
        self.cols = cols
        self.cells: list[
            list[Bubble | None]
        ] = [[None] * cols for _ in range(rows)]

    def in_bounds(self, row: int, col: int) -> bool:
        """Checks if the given position is inside the grid.

        Args:
            row (int): Row index of the cell.
            col (int): Column index of the cell.

        Returns:
            bool: True if the position is valid, False otherwise.
        """
        return 0 <= row < self.rows and 0 <= col < self.cols

    def get(self, row: int, col: int) -> Bubble | None:
        """Gets the content of a specific cell in the grid

        Args:
            row (int): Row index of the cell.
            col (int): Column index of the cell.

        Returns:
            Bubble | None: The bubble at the specified position.
        """
        if self.in_bounds(row, col):
            return self.cells[row][col]
        return None

    def set(self, row: int, col: int, bubble: Bubble | None) -> None:
        """Sets the bubble for a specific cell in the grid (if in bounds).

        Args:
            row (int): Row index of the cell.
            col (int): Column index of the cell.
            bubble (Bubble or None): The bubble to set at position.
        """
        if self.in_bounds(row, col):
            self.cells[row][col] = bubble

    def neighbors(self, row: int, col: int) -> list[tuple[int, int]]:
        """Returns the valid neighboring positions of a cell.

        Args:
            row (int): Row index of the cell.
            col (int): Column index of the cell.

        Returns:
            list[tuple[int, int]]: A list of (row, col) pairs representing
            valid neighboring cells.
        """
        neighbors = []
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

        for dr, dc in directions:
            nr, nc = row + dr, col + dc
            if self.in_bounds(nr, nc):
                neighbors.append((nr, nc))

        return neighbors
