package org.team.deliveryplanner.exception;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Standard structure for API error responses containing status, message, timestamp, and details.
 */
@Getter
@Setter
@Builder
public class ApiError {
    private int status;
    private String message;
    private LocalDateTime timestamp;
    private List<String> errors;
}