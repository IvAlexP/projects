package org.team.deliveryplanner.exception.entity;

/**
 * Exception thrown when a specified status cannot be found in the system.
 */
public class StatusNotFound extends RuntimeException {
    public StatusNotFound(String message) {
        super(String.format("Status not found: %s", message));
    }
}
