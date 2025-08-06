package org.team.deliveryplanner.exception;

/**
 * Exception thrown when a user attempts to access a resource without proper
 * authentication or permissions.
 */
public class Unauthorized extends RuntimeException {
    public Unauthorized() {
        super("Unauthorized access(must be logged in or have the right permissions)");
    }
}
