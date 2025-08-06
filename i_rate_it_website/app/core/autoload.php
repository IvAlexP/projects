<?php

function autoload($class)
{
    $basePath = dirname(dirname(dirname(__FILE__)));
    $paths = [
        $basePath . SEP . 'app' . SEP . 'controllers' . SEP . $class . '.php',
        $basePath . SEP . 'app' . SEP . 'models' . SEP . $class . '.php',
        $basePath . SEP . 'app' . SEP . 'services' . SEP . $class . '.php',
        $basePath . SEP . 'app' . SEP . 'core' . SEP . $class . '.php',
        $basePath . SEP . 'app' . SEP . 'core' . SEP . 'db' . SEP . $class . '.php',
        $basePath . SEP . 'app' . SEP . 'core' . SEP . 'dto' . SEP . $class . '.php'
    ];

    foreach ($paths as $path) {
        if (file_exists($path)) {
            require_once($path);
            return;
        }
    }

    error_log("Class not found: $class");
    echo "Class not found: $class";
    exit();
}

spl_autoload_register('autoload');

try {
    require_once dirname(__FILE__) . '/Environment.php';
    Environment::load();

    Environment::validateRequired([
        'DB_HOST',
        'DB_NAME',
        'JWT_SECRET_KEY'
    ]);
} catch (Exception $e) {
    error_log("Error loading environment variables: " . $e->getMessage());
    if (strpos($e->getMessage(), 'Missing required environment variables') !== false) {
        die("Configuration error: " . $e->getMessage() . ". Please check your .env file.");
    }
}
