"""Defines the Bubble class for bubble objects in the grid. (Model)"""

from .colors import Color
from .bubble_type import BubbleType


class Bubble:
    """Represents a bubble with a specific color and type."""

    def __init__(
        self, color: Color, bubble_type: BubbleType = BubbleType.NORMAL
    ) -> None:
        """Initializes a Bubble with a specific color and type.

        Args:
            color (Color): The color of the bubble.
            bubble_type (BubbleType): The type of the bubble (default: NORMAL).
        """
        self.color = color
        self.bubble_type = bubble_type

    def get_color(self) -> tuple[int, int, int]:
        """Returns the RGB color value of the bubble.

        Returns:
            tuple[int, int, int]: RGB color tuple.
        """
        return self.color.value

    def is_normal(self) -> bool:
        """Checks if the bubble is a normal type.

        Returns:
            bool: True if the bubble is a normal bubble.
        """
        return self.bubble_type == BubbleType.NORMAL

    def is_bomb(self) -> bool:
        """Checks if the bubble is a bomb type.

        Returns:
            bool: True if the bubble is a bomb.
        """
        return self.bubble_type == BubbleType.BOMB

    def is_row_bomb(self) -> bool:
        """Checks if the bubble is a row bomb type.

        Returns:
            bool: True if the bubble is a row bomb.
        """
        return self.bubble_type == BubbleType.ROW_BOMB

    def is_column_bomb(self) -> bool:
        """Checks if the bubble is a column bomb type.

        Returns:
            bool: True if the bubble is a column bomb.
        """
        return self.bubble_type == BubbleType.COLUMN_BOMB
