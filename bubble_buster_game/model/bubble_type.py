"""Defines the BubbleType enumeration for the game. (Model)"""

from enum import Enum


class BubbleType(Enum):
    """Represents the type of bubble and its special behavior.

    Attributes:
        NORMAL: Standard bubble with no special effects
        BOMB: Explodes and removes all bubbles of the same color in the grid
        ROW_BOMB: Removes all bubbles in its row when popped
        COLUMN_BOMB: Removes all bubbles in its column when popped
    """

    NORMAL = "normal"
    BOMB = "bomb"
    ROW_BOMB = "row_bomb"
    COLUMN_BOMB = "column_bomb"
