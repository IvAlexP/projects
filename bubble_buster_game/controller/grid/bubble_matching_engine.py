"""Handles bubble matching and target finding logic."""

from collections import deque
from model import Grid


class BubbleMatchingEngine:
    """Manages bubble matching algorithms and special bubble target finding."""

    @staticmethod
    def find_connected_group(
        grid: Grid, start_row: int, start_col: int
    ) -> set[tuple[int, int]]:
        """
        Finds all bubbles with the same color connected to the starting cell,
        using BFS (up, down, left, right).

        Args:
            grid (Grid): The game board.
            start_row (int): Starting row index.
            start_col (int): Starting column index.

        Returns:
            set[tuple[int, int]]: A set of (row, col) coordinates belonging
            to the connected group. Returns an empty set if the starting
            cell is empty or out of bounds.
        """
        start_bubble = grid.get(start_row, start_col)
        if start_bubble is None:
            return set()

        visited = set()
        queue = deque()
        queue.append((start_row, start_col))
        target_color = start_bubble.color

        while queue:
            row, col = queue.popleft()
            if (row, col) in visited:
                continue

            bubble = grid.get(row, col)
            if bubble is None or bubble.color != target_color:
                continue

            visited.add((row, col))
            neighbors = grid.neighbors(row, col)
            for nr, nc in neighbors:
                if (nr, nc) not in visited:
                    queue.append((nr, nc))

        return visited

    @staticmethod
    def find_bomb_targets(
        grid: Grid, row: int, col: int
    ) -> set[tuple[int, int]]:
        """Finds all bubbles of the same color as the bomb bubble.

        Args:
            grid (Grid): The game board.
            row (int): Row index of the bomb bubble.
            col (int): Column index of the bomb bubble.

        Returns:
            set[tuple[int, int]]: Coordinates of all bubbles
            with the same color.
        """
        bomb_bubble = grid.get(row, col)
        if bomb_bubble is None or not bomb_bubble.is_bomb():
            return set()

        target_color = bomb_bubble.color
        targets = set()

        for r in range(grid.rows):
            for c in range(grid.cols):
                bubble = grid.get(r, c)
                if bubble is not None and bubble.color == target_color:
                    targets.add((r, c))

        return targets

    @staticmethod
    def find_row_bomb_targets(grid: Grid, row: int) -> set[tuple[int, int]]:
        """Finds all bubbles in the specified row.

        Args:
            grid (Grid): The game board.
            row (int): Row index of the row bomb.

        Returns:
            set[tuple[int, int]]: Coordinates of all bubbles in that row.
        """
        targets = set()

        for c in range(grid.cols):
            bubble = grid.get(row, c)
            if bubble is not None:
                targets.add((row, c))

        return targets

    @staticmethod
    def find_column_bomb_targets(grid: Grid, col: int) -> set[tuple[int, int]]:
        """Finds all bubbles in the specified column.

        Args:
            grid (Grid): The game board.
            col (int): Column index of the column bomb.

        Returns:
            set[tuple[int, int]]: Coordinates of all bubbles in that column.
        """
        targets = set()

        for r in range(grid.rows):
            bubble = grid.get(r, col)
            if bubble is not None:
                targets.add((r, col))

        return targets
