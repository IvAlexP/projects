package org.team.deliveryplanner.exception.forms;

/**
 * Exception thrown when an attempt is made to register a username that already
 * exists.
 */
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String message) {
        super(String.format("User %s already exists", message));
    }
}