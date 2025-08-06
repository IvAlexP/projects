package org.team.deliveryplanner.exception.entity;

/**
 * Exception thrown when attempting to add a role that already exists for a
 * user.
 */
public class RoleAlreadyExists extends RuntimeException {
    public RoleAlreadyExists(String message) {
        super(String.format("Role already exists: %s", message));
    }
}
