<?php
/**
 * Environment class for managing environment variables.
 */
class Environment
{
    private static $variables = [];
    private static $loaded = false;

    public static function load($path = null)
    {
        if (self::$loaded) {
            return;
        }

        if ($path === null) {
            $path = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . '.env';
        }

        if (!file_exists($path)) {
            throw new Exception("Environment file not found: " . $path);
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) {
                continue;
            }

            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);

                $key = trim($key);
                $value = trim($value);

                if ((substr($value, 0, 1) === '"' && substr($value, -1) === '"') ||
                    (substr($value, 0, 1) === "'" && substr($value, -1) === "'")
                ) {
                    $value = substr($value, 1, -1);
                }

                self::$variables[$key] = $value;

                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }

        self::$loaded = true;
    }

    public static function get($key, $default = null)
    {
        if (!self::$loaded) {
            self::load();
        }

        if (isset(self::$variables[$key])) {
            return self::$variables[$key];
        }

        if (isset($_ENV[$key])) {
            return $_ENV[$key];
        }

        if (isset($_SERVER[$key])) {
            return $_SERVER[$key];
        }

        $value = getenv($key);
        if ($value !== false) {
            return $value;
        }

        return $default;
    }

    public static function has($key)
    {
        return self::get($key) !== null;
    }

    public static function all()
    {
        if (!self::$loaded) {
            self::load();
        }

        return self::$variables;
    }

    public static function set($key, $value)
    {
        self::$variables[$key] = $value;
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }

    public static function validateRequired($requiredKeys)
    {
        $missing = [];

        foreach ($requiredKeys as $key) {
            if (!self::has($key) || self::get($key) === '') {
                $missing[] = $key;
            }
        }

        if (!empty($missing)) {
            throw new Exception("Missing required environment variables: " . implode(', ', $missing));
        }

        return true;
    }
}
