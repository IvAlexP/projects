package org.team.deliveryplanner.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

/**
 * Data transfer object representing a user's profile with ID, username, roles and optional address.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDto {
    private Integer id;
    private String username;
    private Set<String> roles;
    private AddressDto address;
}
