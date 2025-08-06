package org.team.deliveryplanner.dto.forms;

import lombok.Getter;
import lombok.Setter;

/**
 * Form DTO for adding or removing a role, containing user ID and role name.
 */
@Getter
@Setter
public class RoleChangeDto {
    private Integer userId;
    private String roleName;
}
