<?php
/**
 * InputSanitizer class for sanitizing user input.
 * This class provides methods to sanitize text, email, and integer inputs.
 */
class InputSanitizer
{

    public static function sanitizeText($input)
    {
        if (empty($input)) {
            return '';
        }

        $clean = strip_tags($input);
        $clean = html_entity_decode($clean, ENT_QUOTES, 'UTF-8');

        return trim($clean);
    }

    public static function sanitizeEmail($email)
    {
        return filter_var(trim($email), FILTER_SANITIZE_EMAIL);
    }

    public static function sanitizeInt($input)
    {
        return filter_var($input, FILTER_SANITIZE_NUMBER_INT);
    }
}
