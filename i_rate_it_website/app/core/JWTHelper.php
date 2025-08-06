<?php
require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/**
 * JWTHelper class for generating, validating, and managing JWT tokens.
 */
class JWTHelper
{
    private static function getSecretKey()
    {
        return Environment::get('JWT_SECRET_KEY', 'IRI_LilKartoffel_Default_Secret_Key_2024');
    }

    private static function getAlgorithm()
    {
        return Environment::get('JWT_ALGORITHM', 'HS256');
    }

    private static function getExpirationTime()
    {
        return (int) Environment::get('JWT_EXPIRATION_TIME', 86400); // 24h
    }

    public static function generateToken($user_id, $email, $role_name = null)
    {
        $issued_at = time();
        $expiration = $issued_at + self::getExpirationTime();

        $payload = array(
            'iss' => 'IRI_LilKartoffel',
            'aud' => 'IRI_LilKartoffel_users',
            'iat' => $issued_at,
            'exp' => $expiration,
            'data' => array(
                'user_id' => $user_id,
                'email' => $email,
                'role_name' => $role_name
            )
        );

        return JWT::encode($payload, self::getSecretKey(), self::getAlgorithm());
    }

    public static function validateToken($token)
    {
        try {
            $decoded = JWT::decode($token, new Key(self::getSecretKey(), self::getAlgorithm()));
            return (array) $decoded;
        } catch (Exception $e) {
            return false;
        }
    }

    public static function getUserDataFromToken($token)
    {
        $decoded = self::validateToken($token);
        if ($decoded && isset($decoded['data'])) {
            $data = (array) $decoded['data'];
            return [
                'user_id' => $data['user_id'],
                'email' => $data['email']
            ];
        }
        return false;
    }

    public static function isTokenExpired($token)
    {
        $decoded = self::validateToken($token);
        if ($decoded && isset($decoded['exp'])) {
            return time() > $decoded['exp'];
        }
        return true;
    }

    public static function getTokenFromHeaders()
    {
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
            if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
                return $matches[1];
            }
        }

        if (function_exists('getallheaders')) {
            $headers = getallheaders();
            if (isset($headers['Authorization'])) {
                $auth_header = $headers['Authorization'];
                if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
                    return $matches[1];
                }
            }
        }

        return false;
    }

    public static function requireAuth()
    {
        $token = self::getTokenFromHeaders();

        if (!$token) {
            http_response_code(401);
            echo json_encode(['error' => 'Access token is required']);
            exit;
        }

        $user_data = self::getUserDataFromToken($token);
        if (!$user_data) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid or expired token']);
            exit;
        }

        return $user_data;
    }
}
