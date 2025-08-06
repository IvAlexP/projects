<?php
/**
 * Response class for handling API responses.
 * This class provides methods to send success and error responses in JSON format.
 */
class Response
{
    public static function success($data = [], $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');

        $response = [
            'status' => $statusCode,
            'success' => true
        ];

        if (is_array($data)) {
            foreach ($data as $key => $value) {
                $response[$key] = $value;
            }
        } else if (is_string($data)) {
            $response['message'] = $data;
        } else {
            $response['data'] = $data;
        }

        echo json_encode($response);
    }

    public static function error($message, $errors = null, $statusCode = 400): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');

        $response = [
            'status' => $statusCode,
            'error' => $message
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        echo json_encode($response);
    }
}
