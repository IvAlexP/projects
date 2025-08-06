package org.team.deliveryplanner.exception.entity;

/**
 * Exception thrown when a user does not possess the specified role.
 */
public class UserDoesNotHaveRole extends RuntimeException {
    public UserDoesNotHaveRole(Integer id, String roleName) {
        super(String.format("User with ID = %d does not have role '%s'", id, roleName));
    }
}
