package org.team.deliveryplanner.exception.entity;

/**
 * Exception thrown when an order with the specified ID cannot be found.
 */
public class OrderNotFound extends RuntimeException {
    public OrderNotFound(Integer id) {
        super(String.format(("Order with id %s not found"), id));
    }
}
