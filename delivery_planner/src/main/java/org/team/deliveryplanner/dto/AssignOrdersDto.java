package org.team.deliveryplanner.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * DTO representing a request to assign a specific number of orders to a courier.
 */
public class AssignOrdersDto {

    @NotNull
    private Integer courierId;

    @NotNull
    @Min(1)
    private Integer numOrders;

    public AssignOrdersDto() {
    }

    public AssignOrdersDto(Integer courierId, Integer numOrders) {
        this.courierId = courierId;
        this.numOrders = numOrders;
    }

    public Integer getCourierId() {
        return courierId;
    }

    public void setCourierId(Integer courierId) {
        this.courierId = courierId;
    }

    public Integer getNumOrders() {
        return numOrders;
    }

    public void setNumOrders(Integer numOrders) {
        this.numOrders = numOrders;
    }
}
