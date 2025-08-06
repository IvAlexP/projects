package org.team.deliveryplanner.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO representing order details including client, courier, status, and address
 * information.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {
    private Integer id;
    private Integer clientId;
    private Integer courierId;
    private String description;
    private String statusName;
    private AddressDto address;
    private UserDto courier;
    private UserDto client;
}
