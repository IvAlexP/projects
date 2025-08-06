package org.team.deliveryplanner.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO representing an address with ID, latitude, and longitude.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddressDto {
    private Integer id;
    private Double latitude;
    private Double longitude;
}
