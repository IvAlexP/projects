package org.team.deliveryplanner.exception.entity;

/**
 * Exception thrown when the specified role is not found in the system.
 */
public class RoleNotFound extends RuntimeException {
    public RoleNotFound(String roleName) {
        super("Role not found: " + roleName);
    }
}
