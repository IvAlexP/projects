"""Defines the different states the game can be in."""

from enum import Enum


class GameState(Enum):
    """Enumeration of possible game states."""

    MENU = "menu"
    PLAYING = "playing"
    PAUSED = "paused"
    HISTORY = "history"
    SETTINGS = "settings"
    GAME_OVER = "game_over"
    QUIT = "quit"
