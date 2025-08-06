package org.team.deliveryplanner.exception.forms;

/**
 * Exception thrown when provided password does not match the stored hash.
 */
public class WrongPassword extends RuntimeException {
    public WrongPassword() {
        super("Wrong password");
    }
}
