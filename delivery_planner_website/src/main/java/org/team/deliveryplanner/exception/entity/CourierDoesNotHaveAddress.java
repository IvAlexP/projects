package org.team.deliveryplanner.exception.entity;

/**
 * Exception thrown when a courier does not have an assigned address.
 */
public class CourierDoesNotHaveAddress extends RuntimeException {
    public CourierDoesNotHaveAddress(Integer id) {
        super(String.format("Courier with ID = %d does not have an address", id));
    }
}
