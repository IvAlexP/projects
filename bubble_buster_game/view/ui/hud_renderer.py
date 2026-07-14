"""Renders the HUD (Heads-Up Display) during gameplay."""

import pygame
import config


class HUDRenderer:
    """Handles HUD rendering during gameplay."""

    def __init__(self, screen: pygame.Surface):
        """Initializes the HUD renderer.

        Args:
            screen: The pygame screen surface.
        """
        self.screen = screen
        self.font = pygame.font.Font(None, 36)
        self._create_buttons()

    def draw(
        self, score: int, nr_of_rises: int, max_rises: int, current_level: int
    ) -> None:
        """Draws all HUD elements.

        Args:
            score: Current score.
            nr_of_rises: Number of rises that have occurred.
            max_rises: Maximum rises allowed for current level.
            current_level: Current level number.
        """
        self._draw_score(score)
        self._draw_rises(nr_of_rises, max_rises)
        self._draw_current_level(current_level)

    def _draw_score(self, score: int) -> None:
        """Draws the score.

        Args:
            score: Current score value.
        """
        score_text = self.font.render(
            f"Score: {score}", True, config.TEXT_COLOR
        )
        self.screen.blit(score_text, (10, 10))

    def _draw_rises(self, nr_of_rises: int, max_rises: int) -> None:
        """Draws remaining rises.

        Args:
            nr_of_rises: Number of rises that have occurred.
            max_rises: Maximum rises allowed for current level.
        """
        rises_text = self.font.render(
            f"Lines: {max_rises - nr_of_rises}", True, config.TEXT_COLOR
        )
        self.screen.blit(rises_text, (10, 50))

    def _draw_current_level(self, level: int) -> None:
        """Draws the current level.

        Args:
            level: The current level number.
        """
        level_text = self.font.render(
            f"Level: {level}", True, config.TEXT_COLOR
        )
        self.screen.blit(level_text, (10, 90))

    def draw_pause_button(
        self, mouse_pos: tuple[int, int]
    ) -> None:
        """Draws the pause button.

        Args:
            mouse_pos: Current mouse position.
        """
        self._draw_game_button(
            self.pause_button_rect, "Pause",
            is_active=True, mouse_pos=mouse_pos
        )

    def _draw_game_button(
        self, button_rect: pygame.Rect, text: str,
        is_active: bool, mouse_pos: tuple[int, int]
    ) -> None:
        """Draws a game button with active/inactive states.

        Args:
            button_rect: Rectangle for the button.
            text: Text to display on the button.
            is_active: Whether the button is active/enabled.
            mouse_pos: Current mouse position.
        """
        font_size = 24
        button_font = pygame.font.Font(None, font_size)

        if is_active:
            if button_rect.collidepoint(mouse_pos):
                button_color = config.BUTTON_HOVER_COLOR
            else:
                button_color = config.BUTTON_COLOR
        else:
            button_color = config.INACTIVE_BUTTON_COLOR

        pygame.draw.rect(
            self.screen, button_color, button_rect, border_radius=5
        )
        button_text = button_font.render(text, True, config.TEXT_COLOR)
        text_rect = button_text.get_rect(center=button_rect.center)
        self.screen.blit(button_text, text_rect)

    def draw_undo_redo_buttons(
        self, has_undo: bool, has_redo: bool, mouse_pos: tuple[int, int]
    ) -> None:
        """Draws the undo and redo buttons.

        Args:
            has_undo: Whether undo is available.
            has_redo: Whether redo is available.
            mouse_pos: Current mouse position.
        """
        self._draw_game_button(
            self.undo_button_rect, "Undo", has_undo, mouse_pos
        )
        self._draw_game_button(
            self.redo_button_rect, "Redo", has_redo, mouse_pos
        )

    def _create_buttons(self) -> None:
        """Creates in-game button rectangles."""
        self.pause_button_rect = pygame.Rect(
            config.WINDOW_WIDTH - 90, 10, 80, 30
        )
        self.undo_button_rect = pygame.Rect(
            config.WINDOW_WIDTH - 135, 50, 60, 30
        )
        self.redo_button_rect = pygame.Rect(
            config.WINDOW_WIDTH - 70, 50, 60, 30
        )

    def is_pause_button_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if pause button was clicked."""
        return self.pause_button_rect.collidepoint(pos)

    def is_undo_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if undo button was clicked."""
        return self.undo_button_rect.collidepoint(pos)

    def is_redo_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if redo button was clicked."""
        return self.redo_button_rect.collidepoint(pos)
