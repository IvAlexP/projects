package org.team.deliveryplanner.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object representing a step in the optimized TSP route.
 * Contains order ID, geographic coordinates, and sequence index.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TspStepDto {
    private Integer orderId;
    private Double latitude;
    private Double longitude;
    private Integer stepIndex;
}
