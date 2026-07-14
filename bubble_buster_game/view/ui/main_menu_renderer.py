"""Renders the main menu screen."""

import pygame
import config


class MainMenuRenderer:
    """Handles main menu rendering."""

    def __init__(self, screen: pygame.Surface):
        """Initializes the menu renderer.

        Args:
            screen: The pygame screen surface.
        """
        self.screen = screen
        self.font = pygame.font.Font(None, 36)
        self.title_font = pygame.font.Font(None, 72)
        self.instructions_font = pygame.font.Font(None, 24)
        self._create_buttons()

    def draw(
        self,
        mouse_pos: tuple[int, int],
        has_paused_game: bool = False
    ) -> None:
        """Draws the complete main menu.

        Args:
            mouse_pos: Current mouse position.
            has_paused_game: Whether to show resume button.
        """
        self._draw_title()
        self._draw_instructions()
        self._draw_start_button(self.start_button_rect, mouse_pos)
        self._draw_history_button(self.history_button_rect, mouse_pos)
        if has_paused_game:
            self.draw_resume_button(self.resume_button_rect, mouse_pos)
        self._draw_settings_button(self.settings_button_rect, mouse_pos)

    def _draw_title(self) -> None:
        """Draws the game title."""
        title = self.title_font.render(
            "BubbleBuster", True, config.TITLE_COLOR
        )
        title_rect = title.get_rect(
            center=(config.WINDOW_WIDTH // 2, config.WINDOW_HEIGHT * 0.15)
        )
        self.screen.blit(title, title_rect)

    def _draw_instructions(self) -> None:
        """Draws game instructions."""
        instructions = [
            "HOW TO PLAY:",
            "1. LOOK FOR 3 OR MORE ADJACENT BUBBLES AND CLICK TO POP THEM.",
            "2. BUBBLE BOMBS HELP YOU BY POPPING MORE BUBBLES",
            "3. DON'T LET THE BUBBLES MOVE UP BUBBLES OR THE GAME IS OVER.",
            "4. UNDO PENALTY: -20% OF CURRENT SCORE"
        ]

        y_offset = config.WINDOW_HEIGHT * 0.25
        for line in instructions:
            if line.startswith("HOW TO PLAY:"):
                text = self.instructions_font.render(
                    line, True, config.TITLE_COLOR
                )
            else:
                text = self.instructions_font.render(
                    line, True, config.TEXT_COLOR
                )
            text_rect = text.get_rect(
                center=(config.WINDOW_WIDTH // 2, y_offset)
            )
            self.screen.blit(text, text_rect)
            y_offset += 30

    def _draw_button(
        self, button_rect: pygame.Rect, text: str, mouse_pos: tuple[int, int]
    ) -> None:
        """Draws a button with hover effect.

        Args:
            button_rect: Rectangle for the button.
            text: Text to display on the button.
            mouse_pos: Current mouse position.
        """
        if button_rect.collidepoint(mouse_pos):
            button_color = config.BUTTON_HOVER_COLOR
        else:
            button_color = config.BUTTON_COLOR

        pygame.draw.rect(
            self.screen, button_color, button_rect, border_radius=10
        )
        button_text = self.font.render(text, True, config.TEXT_COLOR)
        text_rect = button_text.get_rect(center=button_rect.center)
        self.screen.blit(button_text, text_rect)

    def _draw_start_button(
        self, button_rect: pygame.Rect, mouse_pos: tuple[int, int]
    ) -> None:
        """Draws the start button.

        Args:
            button_rect: Rectangle for the button.
            mouse_pos: Current mouse position.
        """
        self._draw_button(button_rect, "Start New Game", mouse_pos)

    def _draw_history_button(
        self, button_rect: pygame.Rect, mouse_pos: tuple[int, int]
    ) -> None:
        """Draws the history button.

        Args:
            button_rect: Rectangle for the button.
            mouse_pos: Current mouse position.
        """
        self._draw_button(button_rect, "See My Games", mouse_pos)

    def _draw_settings_button(
        self, button_rect: pygame.Rect, mouse_pos: tuple[int, int]
    ) -> None:
        """Draws the settings button.

        Args:
            button_rect: Rectangle for the button.
            mouse_pos: Current mouse position.
        """
        self._draw_button(button_rect, "Settings", mouse_pos)

    def draw_resume_button(
        self, button_rect: pygame.Rect, mouse_pos: tuple[int, int]
    ) -> None:
        """Draws the resume button.

        Args:
            button_rect: Rectangle for the button.
            mouse_pos: Current mouse position.
        """
        self._draw_button(button_rect, "Resume Game", mouse_pos)

    def _create_buttons(self) -> None:
        """Creates main menu button rectangles."""
        self.start_button_rect = pygame.Rect(
            config.WINDOW_WIDTH // 2 - 100,
            config.WINDOW_HEIGHT * 0.5,
            200, 50
        )
        self.history_button_rect = pygame.Rect(
            config.WINDOW_WIDTH // 2 - 100,
            config.WINDOW_HEIGHT * 0.6,
            200, 50
        )
        self.resume_button_rect = pygame.Rect(
            config.WINDOW_WIDTH // 2 - 100,
            config.WINDOW_HEIGHT * 0.7,
            200, 50
        )
        self.settings_button_rect = pygame.Rect(
            config.WINDOW_WIDTH // 2 - 100,
            config.WINDOW_HEIGHT * 0.8,
            200, 50
        )

    def is_start_button_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if start button was clicked."""
        return self.start_button_rect.collidepoint(pos)

    def is_history_button_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if history button was clicked."""
        return self.history_button_rect.collidepoint(pos)

    def is_settings_button_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if settings button was clicked."""
        return self.settings_button_rect.collidepoint(pos)

    def is_resume_button_clicked(
        self, pos: tuple[int, int], has_paused_game: bool
    ) -> bool:
        """Check if resume button was clicked."""
        return has_paused_game and self.resume_button_rect.collidepoint(pos)
