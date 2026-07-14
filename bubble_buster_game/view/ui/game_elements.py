"""Draws the bubbles and grid layout."""

import pygame
from model import Grid
from config import (
    RADIUS,
    HOVER_COLOR,
    GRID_OFFSET_X,
    GRID_OFFSET_Y,
    CELL_SIZE,
    GRID_ROWS,
    GRID_COLS,
    CONTOUR_COLOR,
    PREVIEW_OFFSET_Y,
)


class GameElementsRenderer:
    """Renders the game state, including grid layout and bubbles."""

    def __init__(self, screen: pygame.Surface) -> None:
        """Initializes the renderer with the Pygame screen.

        Args:
            screen (pygame.Surface): The Pygame surface to render on.
        """
        self.screen = screen

    def bubble_coordinates(self, row: int, col: int) -> tuple[int, int]:
        """Calculates the pixel coordinates of the center of a bubble.

        Args:
            row (int): Row index of the cell.
            col (int): Column index of the cell.

        Returns:
            tuple[int, int]: (x, y) pixel coordinates of the bubble center.
        """
        x = GRID_OFFSET_X + col * CELL_SIZE + CELL_SIZE // 2
        y = GRID_OFFSET_Y + row * CELL_SIZE + CELL_SIZE // 2
        return (x, y)

    def _draw_normal_bubble_at_position(
        self, x: float, y: float, color: tuple[int, int, int], radius: float
    ) -> None:
        """Draws a normal bubble at given pixel coordinates.

        Args:
            x (float): X pixel coordinate.
            y (float): Y pixel coordinate.
            color (tuple[int, int, int]): RGB color of the bubble.
            radius (float): Radius of the bubble.
        """
        if radius > 0:
            pygame.draw.circle(
                self.screen, color, (int(x), int(y)), int(radius)
            )
            pygame.draw.circle(
                self.screen, CONTOUR_COLOR, (int(x), int(y)), int(radius), 1
            )

    def _draw_bomb_bubble_at_position(
        self, x: float, y: float, color: tuple[int, int, int], radius: float
    ) -> None:
        """Draws a bomb bubble at given pixel coordinates.

        Args:
            x (float): X pixel coordinate.
            y (float): Y pixel coordinate.
            color (tuple[int, int, int]): RGB color of the bomb bubble.
            radius (float): Radius of the bubble.
        """
        if radius > 0:
            self._draw_normal_bubble_at_position(x, y, color, radius)
            pygame.draw.circle(
                self.screen, (0, 0, 0), (int(x), int(y)), int(radius * 0.5)
            )
            pygame.draw.circle(
                self.screen, CONTOUR_COLOR,
                (int(x), int(y)), int(radius * 0.5), 1
            )

    def _draw_hover_effect(
        self, x: int, y: int, hover_color: tuple[int, int, int, int]
    ) -> None:
        """Draws a semi-transparent hover effect at given coordinates.

        Args:
            x (int): X pixel coordinate (top-left of cell).
            y (int): Y pixel coordinate (top-left of cell).
            hover_color (tuple[int, int, int, int]): RGBA color.
        """
        surface = pygame.Surface((CELL_SIZE, CELL_SIZE), pygame.SRCALPHA)
        pygame.draw.circle(
            surface, hover_color, (CELL_SIZE // 2, CELL_SIZE // 2), RADIUS
        )
        self.screen.blit(surface, (x, y))

    def draw_grid(
        self, grid: Grid, exclude_positions: set[tuple[int, int]] | None = None
    ) -> None:
        """Draws the grid on the screen.

        Args:
            grid (Grid): The game grid to render.
            exclude_positions (set[tuple[int, int]] | None): Positions to skip.
        """
        if exclude_positions is None:
            exclude_positions = set()

        self._draw_grid_border(grid)

        # Draw bubbles (except those being animated)
        for row in range(grid.rows):
            for col in range(grid.cols):
                if (row, col) not in exclude_positions:
                    bubble = grid.get(row, col)
                    if bubble is not None:
                        if bubble.is_normal():
                            self.draw_normal_bubble(
                                row, col, bubble.get_color()
                            )
                        else:
                            self.draw_bomb_bubble(row, col, bubble.get_color())

    def draw_normal_bubble(
        self, row: int, col: int, color: tuple[int, int, int]
    ) -> None:
        """Draws one normal bubble in the grid

        Args:
            row (int): Row index of the cell.
            col (int): Column index of the cell.
            color (tuple[int, int, int]): Color of the normal bubble.
        """
        x, y = self.bubble_coordinates(row, col)
        self._draw_normal_bubble_at_position(x, y, color, RADIUS)

    def draw_bomb_bubble(
        self, row: int, col: int, color: tuple[int, int, int]
    ) -> None:
        """Draws a bomb bubble in the grid.

        Args:
            row (int): Row index of the cell.
            col (int): Column index of the cell.
            color (tuple[int, int, int]): Color of the bomb bubble.
        """
        x, y = self.bubble_coordinates(row, col)
        self._draw_bomb_bubble_at_position(x, y, color, RADIUS)

    def draw_hover(self, row: int, col: int) -> None:
        """Draws a highlight overlay on a cell (circular).

        Args:
            row (int): Row index of the cell.
            col (int): Column index of the cell.
        """
        x, y = self._cell_top_left(row, col)
        self._draw_hover_effect(x, y, HOVER_COLOR)

    def draw_popping_bubble(
        self, row: int, col: int, color: tuple[int, int, int], progress: float
    ) -> None:
        """Draws a bubble that is in the process of popping.

        Args:
            row (int): Row index of the cell.
            col (int): Column index of the cell.
            color (tuple[int, int, int]): Color of the bubble.
            progress (float): Animation progress from 1.0 to 0.0.
        """
        x, y = self.bubble_coordinates(row, col)
        animated_radius = RADIUS * progress
        self._draw_normal_bubble_at_position(x, y, color, animated_radius)

    def draw_falling_bubble(
        self, from_row: int, from_col: int, to_row: int, to_col: int,
        color: tuple[int, int, int], progress: float,
    ) -> None:
        """Draws a bubble that is falling from one position to another.

        Args:
            from_row (int): Starting row index.
            from_col (int): Starting column index.
            to_row (int): Ending row index.
            to_col (int): Ending column index.
            color (tuple[int, int, int]): Color of the bubble.
            progress (float): Animation progress from 0.0 to 1.0.
        """
        start_x, start_y = self.bubble_coordinates(from_row, from_col)
        end_x, end_y = self.bubble_coordinates(to_row, to_col)

        current_x = start_x + (end_x - start_x) * progress
        current_y = start_y + (end_y - start_y) * progress

        self._draw_normal_bubble_at_position(
            current_x, current_y, color, RADIUS
        )

    def draw_preview_row(self, bubbles: list) -> None:
        """Draws the preview of the next row below the grid.

        Args:
            bubbles (list[Bubble]): List of bubbles to preview.
        """
        for col, bubble in enumerate(bubbles):
            x, y = self._preview_row_coordinates(col)
            color = bubble.get_color()
            self._draw_normal_bubble_at_position(x, y, color, RADIUS)

    def draw_hover_effect_on_cell(
        self, grid: Grid, hovered_cell: tuple[int, int] | None
    ) -> None:
        """Draws the hover effect on a hovered cell if it has a bubble.

        Args:
            grid: The game grid.
            hovered_cell: The (row, col) coordinates of hovered cell or None.
        """
        if hovered_cell:
            row, col = hovered_cell
            bubble = grid.get(row, col)
            if bubble:
                self.draw_hover(row, col)

    def get_cell_from_mouse(
        self, mouse_pos: tuple[int, int]
    ) -> tuple[int, int] | None:
        """Transforms mouse coordinates into grid coordinates

        Args:
            mouse_pos (tuple[int, int]): Mouse coordinates on the screen.

        Returns:
            tuple[int, int] | None: Grid coordinates or None if outside.
        """
        x, y = mouse_pos

        col = (x - GRID_OFFSET_X) // CELL_SIZE
        row = (y - GRID_OFFSET_Y) // CELL_SIZE

        if 0 <= row < GRID_ROWS and 0 <= col < GRID_COLS:
            return (row, col)

        return None

    def _cell_top_left(self, row: int, col: int) -> tuple[int, int]:
        """Calculates the top-left pixel coordinates of a cell.

        Args:
            row (int): Row index of the cell.
            col (int): Column index of the cell.

        Returns:
            tuple[int, int]: pixel coordinates of the cell top-left corner.
        """
        x = GRID_OFFSET_X + col * CELL_SIZE
        y = GRID_OFFSET_Y + row * CELL_SIZE
        return (x, y)

    def _draw_grid_border(self, grid: Grid) -> None:
        """Draws the border around the grid.

        Args:
            grid (Grid): The game grid.
        """
        grid_rect = pygame.Rect(
            GRID_OFFSET_X, GRID_OFFSET_Y,
            grid.cols * CELL_SIZE, grid.rows * CELL_SIZE
        )
        pygame.draw.rect(self.screen, CONTOUR_COLOR, grid_rect, 2)

    def _preview_row_coordinates(self, col: int) -> tuple[int, int]:
        """Calculates coordinates for preview row bubbles.

        Args:
            col (int): Column index.

        Returns:
            tuple[int, int]: (x, y) pixel coordinates for preview bubble.
        """
        x = GRID_OFFSET_X + col * CELL_SIZE + CELL_SIZE // 2
        y = PREVIEW_OFFSET_Y + CELL_SIZE // 2
        return (x, y)
