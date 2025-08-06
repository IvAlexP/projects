<?php
/**
 * Database connection class using PDO.
 * This class implements the Singleton pattern to ensure only one instance of the database connection exists.
 */
class DB
{
    public $pdo;
    private static $instance = null;    
    
    private function __construct()
    {
        $host = Environment::get('DB_HOST', 'localhost');
        $db = Environment::get('DB_NAME', 'lilkartoffel');
        $user = Environment::get('DB_USER', 'root');
        $pass = Environment::get('DB_PASS', '');
        
        $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
        
        try {
            $this->pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }

    public static function getInstance()
    {
        if (DB::$instance == null) {
            DB::$instance = new DB();
        }
        return DB::$instance;
    }
}