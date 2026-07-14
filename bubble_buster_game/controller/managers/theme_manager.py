"""Manages theme configurations for the game."""

import config


class ThemeManager:
    """Handles dynamic theme switching."""

    THEMES = {
        "dark": {
            "BG_COLOR": (30, 30, 40),
            "BUTTON_COLOR": (50, 50, 60),
            "BUTTON_HOVER_COLOR": (100, 100, 120),
        },
        "light": {
            "BG_COLOR": (180, 201, 222),
            "BUTTON_COLOR": (200, 210, 220),
            "BUTTON_HOVER_COLOR": (150, 180, 210),
        },
        "basic": {
            "BG_COLOR": (60, 85, 183),
            "BUTTON_COLOR": (0, 0, 0),
            "BUTTON_HOVER_COLOR": (68, 194, 56),
        },
    }

    @staticmethod
    def apply_theme(theme_name: str) -> None:
        """Apply a theme by updating config values.

        Args:
            theme_name: Name of the theme to apply ("dark", "light", "basic").
        """
        if theme_name not in ThemeManager.THEMES:
            print(f"Theme '{theme_name}' not found. Using 'basic' theme.")
            theme_name = "basic"

        theme = ThemeManager.THEMES[theme_name]

        config.BG_COLOR = theme["BG_COLOR"]
        config.BUTTON_COLOR = theme["BUTTON_COLOR"]
        config.BUTTON_HOVER_COLOR = theme["BUTTON_HOVER_COLOR"]

        print(f"Theme '{theme_name}' applied successfully!")
