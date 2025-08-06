package org.team.deliveryplanner.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.team.deliveryplanner.exception.entity.*;
import org.team.deliveryplanner.exception.forms.UserAlreadyExistsException;
import org.team.deliveryplanner.exception.forms.UserNotFound;
import org.team.deliveryplanner.exception.forms.ValidationException;
import org.team.deliveryplanner.exception.forms.WrongPassword;

import java.time.LocalDateTime;

/**
 * Global exception handler that converts exceptions into standardized ApiError
 * responses.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles UserNotFound exceptions and returns a 404 ApiError.
     *
     * @param ex the UserNotFound exception thrown
     * @return ResponseEntity containing ApiError with NOT_FOUND status
     */
    @ExceptionHandler(UserNotFound.class)
    public ResponseEntity<ApiError> handleUserNotFound(UserNotFound ex) {
        ApiError error = ApiError.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * Handles ValidationException and returns a 400 ApiError.
     *
     * @param ex the ValidationException thrown
     * @return ResponseEntity containing ApiError with BAD_REQUEST status
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiError> handleValidationException(ValidationException ex) {
        ApiError error = ApiError.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.badRequest().body(error);
    }

    /**
     * Handles WrongPassword exceptions and returns a 401 ApiError.
     *
     * @param ex the WrongPassword exception thrown
     * @return ResponseEntity containing ApiError with UNAUTHORIZED status
     */
    @ExceptionHandler(WrongPassword.class)
    public ResponseEntity<ApiError> handleWrongPassword(WrongPassword ex) {
        ApiError error = ApiError.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    /**
     * Handles Unauthorized access exceptions and returns a 401 ApiError.
     *
     * @param ex the Unauthorized exception thrown
     * @return ResponseEntity containing ApiError with UNAUTHORIZED status
     */
    @ExceptionHandler(Unauthorized.class)
    public ResponseEntity<ApiError> handleUnauthorized(Unauthorized ex) {
        ApiError error = ApiError.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    /**
     * Handles OrderNotFound exceptions and returns a 404 ApiError.
     *
     * @param ex the OrderNotFound exception thrown
     * @return ResponseEntity containing ApiError with NOT_FOUND status
     */
    @ExceptionHandler(OrderNotFound.class)
    public ResponseEntity<ApiError> handleOrderNotFound(OrderNotFound ex) {
        ApiError error = ApiError.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * Handles StatusNotFound exceptions and returns a 404 ApiError.
     *
     * @param ex the StatusNotFound exception thrown
     * @return ResponseEntity containing ApiError with NOT_FOUND status
     */
    @ExceptionHandler(StatusNotFound.class)
    public ResponseEntity<ApiError> handleStatusNotFound(StatusNotFound ex) {
        ApiError error = ApiError.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * Handles RoleNotFound exceptions and returns a 404 ApiError.
     *
     * @param ex the RoleNotFound exception thrown
     * @return ResponseEntity containing ApiError with NOT_FOUND status
     */
    @ExceptionHandler(RoleNotFound.class)
    public ResponseEntity<ApiError> handleRoleNotFound(RoleNotFound ex) {
        ApiError error = ApiError.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * Handles RoleAlreadyExists conflicts and returns a 409 ApiError.
     *
     * @param ex the RoleAlreadyExists exception thrown
     * @return ResponseEntity containing ApiError with CONFLICT status
     */
    @ExceptionHandler(RoleAlreadyExists.class)
    public ResponseEntity<ApiError> handleRoleAlreadyExists(RoleAlreadyExists ex) {
        ApiError error = ApiError.builder()
                .status(HttpStatus.CONFLICT.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    /**
     * Handles MethodArgumentNotValidException and returns a 400 ApiError with the
     * first validation error.
     *
     * @param ex the MethodArgumentNotValidException thrown
     * @return ResponseEntity containing ApiError with BAD_REQUEST status
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        ApiError error = ApiError.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.badRequest().body(error);
    }

    /**
     * Handles UserAlreadyExistsException conflicts and returns a 409 ApiError.
     *
     * @param ex the UserAlreadyExistsException thrown
     * @return ResponseEntity containing ApiError with CONFLICT status
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleUserExists(UserAlreadyExistsException ex) {
        ApiError error = ApiError.builder()
                .status(HttpStatus.CONFLICT.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    /**
     * Handles CourierDoesNotHaveAddress exceptions and returns a 406 ApiError.
     *
     * @param ex the CourierDoesNotHaveAddress exception thrown
     * @return ResponseEntity containing ApiError with NOT_ACCEPTABLE status
     */
    @ExceptionHandler(CourierDoesNotHaveAddress.class)
    public ResponseEntity<ApiError> handleCourierDoesNotHaveAddress(CourierDoesNotHaveAddress ex) {
        ApiError error = ApiError.builder()
                .status(HttpStatus.NOT_ACCEPTABLE.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(error);
    }

    /**
     * Handles UserDoesNotHaveRole exceptions and returns a 406 ApiError.
     *
     * @param ex the UserDoesNotHaveRole exception thrown
     * @return ResponseEntity containing ApiError with NOT_ACCEPTABLE status
     */
    @ExceptionHandler(UserDoesNotHaveRole.class)
    public ResponseEntity<ApiError> handleUserDoesNotHaveRole(UserDoesNotHaveRole ex) {
        ApiError error = ApiError.builder()
                .status(HttpStatus.NOT_ACCEPTABLE.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(error);
    }
}
