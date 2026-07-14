"""Renders the pause menu overlay."""

import pygame
import config


class PauseMenuRenderer:
    """Handles pause menu rendering."""

    def __init__(self, screen: pygame.Surface):
        """Initializes the pause menu renderer.

        Args:
            screen: The pygame screen surface.
        """
        self.screen = screen
        self.font = pygame.font.Font(None, 36)
        self.title_font = pygame.font.Font(None, 72)
        self._create_buttons()

    def draw(
        self,
        mouse_pos: tuple[int, int]
    ) -> None:
        """Draws the pause menu overlay.

        Args:
            mouse_pos: Current mouse position.
        """
        self._draw_overlay()
        self._draw_title()
        self._draw_button(
            self.resume_button_rect, "Resume Game", mouse_pos
        )
        self._draw_button(
            self.save_and_quit_button_rect, "Save & Quit", mouse_pos
        )
        self._draw_button(
            self.new_game_button_rect, "Start New Game", mouse_pos
        )
        self._draw_button(
            self.quit_button_rect, "Quit", mouse_pos
        )

    def _draw_overlay(self) -> None:
        """Draws a semi-transparent overlay over the game screen."""
        overlay = pygame.Surface(
            (config.WINDOW_WIDTH, config.WINDOW_HEIGHT)
        )
        overlay.set_alpha(128)
        overlay.fill((0, 0, 0))
        self.screen.blit(overlay, (0, 0))

    def _draw_title(self) -> None:
        """Draws the pause menu title."""
        title = self.title_font.render(
            "Game paused", True, config.TITLE_COLOR
        )
        title_rect = title.get_rect(
            center=(config.WINDOW_WIDTH // 2, config.WINDOW_HEIGHT // 4)
        )
        self.screen.blit(title, title_rect)

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
        """Creates pause menu button rectangles."""
        self.resume_button_rect = pygame.Rect(
            config.WINDOW_WIDTH // 2 - 110,
            config.WINDOW_HEIGHT * 0.45,
            220, 50
        )
        self.save_and_quit_button_rect = pygame.Rect(
            config.WINDOW_WIDTH // 2 - 110,
            config.WINDOW_HEIGHT * 0.45 + 65,
            220, 50
        )
        self.new_game_button_rect = pygame.Rect(
            config.WINDOW_WIDTH // 2 - 110,
            config.WINDOW_HEIGHT * 0.45 + 130,
            220, 50
        )
        self.quit_button_rect = pygame.Rect(
            config.WINDOW_WIDTH // 2 - 110,
            config.WINDOW_HEIGHT * 0.45 + 195,
            220, 50
        )

    def is_resume_button_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if resume button was clicked."""
        return self.resume_button_rect.collidepoint(pos)

    def is_save_and_quit_button_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if save & quit button was clicked."""
        return self.save_and_quit_button_rect.collidepoint(pos)

    def is_new_game_button_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if new game button was clicked."""
        return self.new_game_button_rect.collidepoint(pos)

    def is_quit_button_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if quit button was clicked."""
        return self.quit_button_rect.collidepoint(pos)
