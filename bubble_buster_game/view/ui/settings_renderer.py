"""Renders the settings screen."""

import pygame
import config


class SettingsRenderer:
    """Handles settings screen rendering."""

    def __init__(self, screen: pygame.Surface):
        """Initializes the settings renderer.

        Args:
            screen: The pygame screen surface.
        """
        self.screen = screen
        self.font = pygame.font.Font(None, 36)
        self.title_font = pygame.font.Font(None, 72)
        self.description_font = pygame.font.Font(None, 24)
        self._create_buttons()

    def draw(
        self,
        mouse_pos: tuple[int, int]
    ) -> None:
        """Draws the complete settings menu.

        Args:
            mouse_pos: Current mouse position.
        """
        self._draw_title()
        self._draw_description()
        self._draw_button(self.dark_mode_button_rect, "Dark Mode", mouse_pos)
        self._draw_button(self.light_mode_button_rect, "Light Mode", mouse_pos)
        self._draw_button(self.basic_mode_button_rect, "Basic Mode", mouse_pos)
        self._draw_button(self.back_button_rect, "Back", mouse_pos)

    def _draw_title(self) -> None:
        """Draws the settings title."""
        title = self.title_font.render("Settings", True, config.TITLE_COLOR)
        title_rect = title.get_rect(
            center=(config.WINDOW_WIDTH // 2, config.WINDOW_HEIGHT // 6)
        )
        self.screen.blit(title, title_rect)

    def _draw_description(self) -> None:
        """Draws the theme selection description."""
        description = self.description_font.render(
            "Select a theme:", True, config.TEXT_COLOR
        )
        desc_rect = description.get_rect(
            center=(config.WINDOW_WIDTH // 2, config.WINDOW_HEIGHT // 4)
        )
        self.screen.blit(description, desc_rect)

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

    def _create_buttons(self) -> None:
        """Creates settings menu button rectangles."""
        self.dark_mode_button_rect = pygame.Rect(
            config.WINDOW_WIDTH // 2 - 110,
            config.WINDOW_HEIGHT * 0.40,
            220, 50
        )
        self.light_mode_button_rect = pygame.Rect(
            config.WINDOW_WIDTH // 2 - 110,
            config.WINDOW_HEIGHT * 0.52,
            220, 50
        )
        self.basic_mode_button_rect = pygame.Rect(
            config.WINDOW_WIDTH // 2 - 110,
            config.WINDOW_HEIGHT * 0.64,
            220, 50
        )
        self.back_button_rect = pygame.Rect(
            config.WINDOW_WIDTH // 2 - 100,
            config.WINDOW_HEIGHT - 80,
            200, 50
        )

    def is_dark_mode_button_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if dark mode button was clicked."""
        return self.dark_mode_button_rect.collidepoint(pos)

    def is_light_mode_button_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if light mode button was clicked."""
        return self.light_mode_button_rect.collidepoint(pos)

    def is_basic_mode_button_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if basic mode button was clicked."""
        return self.basic_mode_button_rect.collidepoint(pos)

    def is_back_button_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if back button was clicked."""
        return self.back_button_rect.collidepoint(pos)
