package org.team.deliveryplanner.dto.forms;

import lombok.*;

/**
 * DTO representing the authentication response with a bearer token.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String accessToken;
    @Builder.Default
    private String tokenType = "Bearer";
}
