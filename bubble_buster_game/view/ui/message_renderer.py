"""Renders temporary messages during gameplay."""

import pygame
import config


class MessageRenderer:
    """Handles temporary message rendering."""

    def __init__(self, screen: pygame.Surface):
        """Initializes the message renderer.

        Args:
            screen: The pygame screen surface.
        """
        self.screen = screen
        self.font = pygame.font.Font(None, 36)
        self._create_buttons()

    def _draw_button(
        self,
        button_rect: pygame.Rect,
        text: str,
        mouse_pos: tuple[int, int]
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

    def _draw_game_over_text(self) -> None:
        """Draws the game over text."""
        game_over_text = self.font.render(
            "Game over!", True, config.TEXT_COLOR
        )
        text_rect = game_over_text.get_rect(
            center=(config.WINDOW_WIDTH // 2, config.WINDOW_HEIGHT // 2)
        )
        self.screen.blit(game_over_text, text_rect)

    def draw_game_over(
        self, mouse_pos: tuple[int, int]
    ) -> None:
        """Draws the game over message with buttons.

        Args:
            mouse_pos: Current mouse position.
        """
        self._draw_game_over_text()
        self._draw_button(self.play_again_rect, "Play Again", mouse_pos)
        self._draw_button(self.menu_rect, "Menu", mouse_pos)

    def draw_level_completed(self, level: int) -> None:
        """Draws the level completed message.

        Args:
            level: The level that was completed.
        """
        level_text = self.font.render(
            f"Level {level} completed!", True, config.TEXT_COLOR
        )
        text_rect = level_text.get_rect(
            center=(config.WINDOW_WIDTH // 2, config.WINDOW_HEIGHT // 2)
        )
        self.screen.blit(level_text, text_rect)

    def draw_level_started(self, level: int) -> None:
        """Draws the level started message.

        Args:
            level: The level that was started.
        """
        level_text = self.font.render(
            f"Level {level} started!", True, config.TEXT_COLOR
        )
        text_rect = level_text.get_rect(
            center=(config.WINDOW_WIDTH // 2, config.WINDOW_HEIGHT // 2)
        )
        self.screen.blit(level_text, text_rect)

    def draw_undo_penalty(self, penalty: int) -> None:
        """Draws the undo penalty message.

        Args:
            penalty: The penalty points deducted.
        """
        penalty_text = self.font.render(
            f"-{penalty} points!", True, config.TEXT_COLOR
        )
        text_rect = penalty_text.get_rect(
            center=(config.WINDOW_WIDTH // 2, config.WINDOW_HEIGHT // 2)
        )
        self.screen.blit(penalty_text, text_rect)

    def _create_buttons(self) -> None:
        """Creates game over button rectangles."""
        self.play_again_rect = pygame.Rect(
            config.WINDOW_WIDTH // 2 - 110,
            config.WINDOW_HEIGHT * 0.5 + 60,
            220, 50
        )
        self.menu_rect = pygame.Rect(
            config.WINDOW_WIDTH // 2 - 110,
            config.WINDOW_HEIGHT * 0.5 + 125,
            220, 50
        )

    def is_play_again_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if play again button was clicked."""
        return self.play_again_rect.collidepoint(pos)

    def is_menu_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if menu button was clicked."""
        return self.menu_rect.collidepoint(pos)
