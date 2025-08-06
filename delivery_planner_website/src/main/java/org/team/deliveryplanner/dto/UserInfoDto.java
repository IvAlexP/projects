package org.team.deliveryplanner.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

/**
 * Data transfer object containing basic user information: ID, username, and roles.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDto {
    private Integer id;
    private String username;
    private Set<String> roles;
}