<?php

// echo "<pre>";
// echo "Method: " . $_SERVER['REQUEST_METHOD'] . "\n";
// echo "Request URI: " . $_SERVER['REQUEST_URI'] . "\n";
// echo "Script name: " . $_SERVER['SCRIPT_NAME'] . "\n";
// echo "GET data:\n";
// print_r($_GET);
// echo "POST data:\n";
// print_r($_POST);
// echo "Headers:\n";
// print_r(getallheaders());
// echo "</pre>";


define('SEP', DIRECTORY_SEPARATOR);
define('PDIR', dirname(__FILE__));

session_start();

require_once '../app/core/autoload.php';

Environment::load();

$router = new Router();

$router->dispatch($_SERVER['REQUEST_URI'], strtolower($_SERVER['REQUEST_METHOD']));
