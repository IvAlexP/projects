package org.team.deliveryplanner.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Simple response DTO wrapping a message string for API operations.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SimpleResponse {
    private String message;
}
