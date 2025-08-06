<?php

/** 
 * Class for validating user inputs during registration, login, and creating or updating users
 */
class ValidationsController extends BaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    // Validations

    private function validateEmailFormat(string $email): void
    {
        if (empty($email)) {
            throw new Exception('Email is required');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format');
        }
    }

    private function validatePasswordStrength(string $password): void
    {
        if (empty($password)) {
            throw new Exception('Password is required');
        }

        $errors = [];

        if (strlen($password) < 8) {
            $errors[] = 'at least 8 characters';
        }

        if (!preg_match('/[A-Z]/', $password)) {
            $errors[] = '1 uppercase letter';
        }

        if (!preg_match('/[a-z]/', $password)) {
            $errors[] = '1 lowercase letter';
        }

        if (!preg_match('/[0-9]/', $password)) {
            $errors[] = '1 number';
        }

        if (!preg_match('/[!#$*+\-]/', $password)) {
            $errors[] = '1 symbol (!#$*+-)';
        }

        if (!empty($errors)) {
            throw new Exception('Password must include: ' . implode(', ', $errors));
        }
    }

    private function validateNameFormat(string $name, string $fieldName = 'Name'): void
    {
        if (empty(trim($name))) {
            throw new Exception("$fieldName is required");
        }

        if (strlen($name) < 2) {
            throw new Exception("$fieldName must be at least 2 characters long");
        }

        if (strlen($name) > 50) {
            throw new Exception("$fieldName cannot be longer than 50 characters");
        }

        if (!preg_match('/^[a-zA-Z\s]+$/', $name)) {
            throw new Exception("$fieldName can only contain letters and spaces");
        }
    }

    private function validateCityFormat(string $city): void
    {
        if (empty(trim($city))) {
            throw new Exception('City is required');
        }

        if (strlen($city) < 2) {
            throw new Exception('City must be at least 2 characters long');
        }

        if (strlen($city) > 100) {
            throw new Exception('City cannot be longer than 100 characters');
        }

        if (!preg_match('/^[a-zA-ZăâîșțĂÂÎȘȚ\s\-]+$/u', $city)) {
            throw new Exception('City can only contain letters and hyphens');
        }
    }

    private function checkEmailExists(string $email): void
    {
        $user = $this->userModel->findByEmail($email);
        if ($user) {
            throw new Exception('This email is already in use');
        }
    }

    private function checkEmailNotExists(string $email): void
    {
        $user = $this->userModel->findByEmail($email);
        if (!$user) {
            throw new Exception('Email not found');
        }
    }

    // API validations for dynamic responses in frontend

    public function validateEmailRegistration($email): void
    {
        try {
            $this->validateEmailFormat($email);
            $this->checkEmailExists($email);
            Response::success(['success' => true]);
        } catch (Exception $e) {
            Response::error($e->getMessage() . '!');
        }
    }

    public function validatePasswordRegistration($password): void
    {
        try {
            $this->validatePasswordStrength($password);
            Response::success(['success' => true]);
        } catch (Exception $e) {
            Response::error($e->getMessage());
        }
    }

    public function validateNameRegistration($name): void
    {
        try {
            $this->validateNameFormat($name);
            Response::success(['success' => true]);
        } catch (Exception $e) {
            Response::error($e->getMessage() . '!');
        }
    }

    public function validateCityRegistration($city): void
    {
        try {
            $this->validateCityFormat($city);
            Response::success(['success' => true]);
        } catch (Exception $e) {
            Response::error($e->getMessage() . '!');
        }
    }

    public function validateEmailLogin($email): void
    {
        try {
            $this->validateEmailFormat($email);
            $this->checkEmailNotExists($email);
            Response::success(['success' => true]);
        } catch (Exception $e) {
            Response::error($e->getMessage() . '!');
        }
    }

    // Internal validation methods for user creation and updates

    public function validateEmail(string $email): string
    {
        $this->validateEmailFormat($email);
        return trim($email);
    }

    public function validatePassword(string $password): string
    {
        $this->validatePasswordStrength($password);
        return $password;
    }

    public function validateName(string $name, string $fieldName = 'Name'): string
    {
        $this->validateNameFormat($name, $fieldName);
        return trim($name);
    }

    public function validateCity(string $city): string
    {
        $this->validateCityFormat($city);
        return trim($city);
    }
}
