"""Renders the game history screen."""

import pygame
import config


class HistoryRenderer:
    """Handles game history screen rendering."""

    def __init__(self, screen: pygame.Surface):
        """Initializes the history renderer.

        Args:
            screen: The pygame screen surface.
        """
        self.screen = screen
        self.font = pygame.font.Font(None, 36)
        self.title_font = pygame.font.Font(None, 72)
        self.stats_font = pygame.font.Font(None, 28)
        self.list_font = pygame.font.Font(None, 22)
        self.header_font = pygame.font.Font(None, 24)
        self._create_buttons()

    def draw(
        self, games: list[dict], statistics: dict,
        mouse_pos: tuple[int, int]
    ) -> None:
        """Draws the complete history screen.

        Args:
            games: List of game entries.
            statistics: Dictionary with best_score, total_games, average_score.
            mouse_pos: Current mouse position.
        """
        self._draw_title()
        self._draw_statistics(statistics)
        self._draw_games_list(games)
        self._draw_back_button(self.back_button_rect, mouse_pos)

    def _draw_title(self) -> None:
        """Draws the history screen title."""
        title = self.title_font.render("My Games", True, config.TITLE_COLOR)
        title_rect = title.get_rect(center=(config.WINDOW_WIDTH // 2, 50))
        self.screen.blit(title, title_rect)

    def _draw_statistics(self, statistics: dict) -> None:
        """Draws the game statistics.

        Args:
            statistics: Dictionary with game statistics.
        """
        stats_y = 120
        stats_text = [
            f"Total Games: {statistics['total_games']}",
            f"Best Score: {statistics['best_score']}",
            f"Average Score: {statistics['average_score']}"
        ]

        for line in stats_text:
            text = self.stats_font.render(line, True, config.TITLE_COLOR)
            text_rect = text.get_rect(
                center=(config.WINDOW_WIDTH // 2, stats_y)
            )
            self.screen.blit(text, text_rect)
            stats_y += 30

    def _draw_games_list(self, games: list[dict]) -> None:
        """Draws the list of recent games.

        Args:
            games: List of game entries.
        """
        y_offset = config.WINDOW_HEIGHT * 0.4
        header_text = self.header_font.render(
            "Recent Games:", True, config.TEXT_COLOR
        )
        header_rect = header_text.get_rect(
            center=(config.WINDOW_WIDTH // 2, y_offset)
        )
        self.screen.blit(header_text, header_rect)

        y_offset += 30
        if len(games) > 7:
            recent_games = games[-7:]
        else:
            recent_games = games.copy()

        for game in recent_games:
            game_text = (f"Score: {game['score']} | "
                         f"Level: {game['level']} | "
                         f"{game['date']}")
            text = self.list_font.render(game_text, True, config.TEXT_COLOR)
            text_rect = text.get_rect(
                center=(config.WINDOW_WIDTH // 2, y_offset)
            )
            self.screen.blit(text, text_rect)
            y_offset += 30

    def _draw_back_button(
        self, button_rect: pygame.Rect, mouse_pos: tuple[int, int]
    ) -> None:
        """Draws the back button.

        Args:
            button_rect: Rectangle for the button.
            mouse_pos: Current mouse position.
        """
        if button_rect.collidepoint(mouse_pos):
            button_color = config.BUTTON_HOVER_COLOR
        else:
            button_color = config.BUTTON_COLOR

        pygame.draw.rect(
            self.screen, button_color, button_rect, border_radius=10
        )

        button_text = self.font.render("Back to Menu", True, config.TEXT_COLOR)
        text_rect = button_text.get_rect(center=button_rect.center)
        self.screen.blit(button_text, text_rect)

    def _create_buttons(self) -> None:
        """Creates history screen button rectangles."""
        self.back_button_rect = pygame.Rect(
            config.WINDOW_WIDTH // 2 - 100, config.WINDOW_HEIGHT - 80, 200, 50
        )

    def is_back_button_clicked(self, pos: tuple[int, int]) -> bool:
        """Check if back button was clicked."""
        return self.back_button_rect.collidepoint(pos)
