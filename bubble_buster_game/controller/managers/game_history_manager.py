"""Manages game history storage."""

import json
import os
from datetime import datetime
from model import Bubble, Color, BubbleType


class GameHistoryManager:
    """Handles saving and loading game history."""

    def __init__(self) -> None:
        """Initializes the game history manager."""
        self.filepath = "game_history.json"
        self.paused_filepath = "paused_game.json"
        if not os.path.exists(self.filepath):
            with open(self.filepath, 'w') as f:
                json.dump({"games": []}, f)

    def save_game(self, score: int, level: int) -> None:
        """Saves a completed game to history.

        Args:
            score: Final score of the game.
            level: Level reached in the game.
        """
        history = self.load_history()

        game_entry = {
            "score": score,
            "level": level,
            "date": datetime.now().strftime("%d/%m/%Y %H:%M")
        }

        history["games"].append(game_entry)

        with open(self.filepath, 'w') as f:
            json.dump(history, f, indent=2)

    def load_history(self) -> dict:
        """Loads game history from file.

        Returns:
            dict: Dictionary containing all game entries.
        """
        try:
            with open(self.filepath, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {"games": []}

    def get_all_games(self) -> list[dict]:
        """Returns all games in chronological order (oldest first).

        Returns:
            list[dict]: List of game entries.
        """
        history = self.load_history()
        return history.get("games", [])

    def get_statistics(self) -> dict:
        """Calculates statistics from game history.

        Returns:
            dict: Different types of statistics.
        """
        games = self.get_all_games()

        if not games:
            return {
                "best_score": 0,
                "total_games": 0,
                "average_score": 0
            }

        scores = [game["score"] for game in games]

        return {
            "best_score": max(scores),
            "total_games": len(games),
            "average_score": sum(scores) // len(scores)
        }

    def save_paused_game(self, game_data: dict) -> None:
        """Saves a paused game state to file.

        Args:
            game_data: Dictionary containing all game state data.
        """
        with open(self.paused_filepath, 'w') as f:
            json.dump(game_data, f, indent=2)

    def load_paused_game(self) -> dict | None:
        """Loads a paused game state from file.

        Returns:
            dict | None: Paused game data or None if not found.
        """
        try:
            with open(self.paused_filepath, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return None

    def has_paused_game(self) -> bool:
        """Checks if a paused game exists.

        Returns:
            bool: True if a paused game file exists.
        """
        return os.path.exists(self.paused_filepath)

    def delete_paused_game(self) -> None:
        """Deletes the paused game save file."""
        if os.path.exists(self.paused_filepath):
            os.remove(self.paused_filepath)

    @staticmethod
    def serialize_bubble(bubble: Bubble | None) -> dict | None:
        """Converts a Bubble object to a JSON-serializable dictionary.

        Args:
            bubble: The Bubble object to serialize.

        Returns:
            dict | None: Dictionary with color RGB and type string.
        """
        if bubble is None:
            return None
        return {
            "color": bubble.get_color(),
            "type": bubble.bubble_type.value
        }

    @staticmethod
    def deserialize_bubble(data: dict | None) -> Bubble | None:
        """Converts a dictionary back to a Bubble object.

        Args:
            data: Dictionary with color and type data.

        Returns:
            Bubble | None: Reconstructed Bubble object or None.
        """
        if data is None:
            return None

        color_tuple = tuple(data["color"])
        color = None
        for c in Color:
            if c.value == color_tuple:
                color = c
                break
        if color is None:
            return None

        bubble_type = BubbleType(data["type"])

        return Bubble(color, bubble_type)
