package org.team.deliveryplanner.exception.forms;

/**
 * Exception thrown when a user with given identifier is not found.
 */
public class UserNotFound extends RuntimeException {
    public UserNotFound(String user) {
        super(String.format("User %s not found", user));
    }

    public UserNotFound(int userId) {
        super(String.format("User with ID %d not found", userId));
    }
}
