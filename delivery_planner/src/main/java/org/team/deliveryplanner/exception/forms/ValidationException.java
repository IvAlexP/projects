package org.team.deliveryplanner.exception.forms;

/**
 * Exception for representing validation errors with a custom message.
 */
public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
}