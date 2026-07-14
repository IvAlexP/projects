"""Defines the Color enumeration for bubble colors in the game. (Model)"""

from enum import Enum


class Color(Enum):
    """Represents the possible colors of a bubble in the game.

    Attributes:
        RED: Red bubble
        GREEN: Green bubble
        BLUE: Blue bubble
        YELLOW: Yellow bubble
    """

    RED = (227, 61, 0)
    GREEN = (48, 222, 0)
    BLUE = (7, 170, 230)
    YELLOW = (209, 204, 0)
