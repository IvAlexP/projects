package org.team.deliveryplanner.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.team.deliveryplanner.dto.*;
import org.team.deliveryplanner.dto.forms.CreateOrderDto;
import org.team.deliveryplanner.repository.AddressRepository;
import org.team.deliveryplanner.repository.OrderRepository;
import org.team.deliveryplanner.repository.StatusRepository;
import org.team.deliveryplanner.repository.UserRepository;
import org.team.deliveryplanner.service.OrdersService;

import java.util.List;

/**
 * Controller for managing order-related operations.
 */
@RestController
@RequestMapping("/api/orders")
public class OrdersController {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final StatusRepository statusRepository;
    private final AddressRepository addressRepository;


    private final OrdersService ordersService;


    /**
     * Constructs an OrdersController with the specified dependencies.
     * @param orderRepository the order repository
     * @param userRepository the user repository
     * @param statusRepository the status repository
     * @param addressRepository the address repository
     * @param ordersService the orders service
     */
    public OrdersController(OrderRepository orderRepository,
                            UserRepository userRepository,
                            StatusRepository statusRepository,
                            AddressRepository addressRepository, OrdersService ordersService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.statusRepository = statusRepository;
        this.addressRepository = addressRepository;
        this.ordersService = ordersService;
    }

    /**
     * Retrieves the orders of the currently authenticated user.
     * @param auth the authentication object of the current user
     * @return a list of orders belonging to the authenticated user
     */
    @GetMapping("/my")
    @Operation(summary = "Get user orders", description = "Fetches the orders of the currently authenticated user.")
    public ResponseEntity<List<OrderDto>> getMyOrders(Authentication auth) {
        return ResponseEntity.ok(ordersService.getMyOrders(auth));
    }

    /**
     * Marks an order as done by the courier.
     * @param id the ID of the order to mark as done
     * @param auth the authentication object of the current user
     * @return a response indicating the success of the operation
     */
    @PutMapping("/{id}/done")
    @Operation(summary = "Mark order as done", description = "Marks an order as done by the courier.")
    public ResponseEntity<?> markOrderDone(@PathVariable Integer id, Authentication auth) {
        return ResponseEntity.ok(ordersService.markOrderDone(id, auth));
    }

    /**
     * Creates a new order.
     * @param createOrderDto the data transfer object containing order details
     * @param auth the authentication object of the current user
     * @return a response containing the details of the created order
     */
    @PostMapping
    @Operation(summary = "Create order", description = "Creates a new order.")
    public ResponseEntity<SimpleResponse> createOrder(@Valid @RequestBody CreateOrderDto createOrderDto, Authentication auth) {
        return ResponseEntity.ok(ordersService.createOrder(createOrderDto, auth));
    }

    /**
     * Retrieves the optimized route for the user's orders using Kruskal's algorithm.
     * @param auth the authentication object of the current user
     * @return a list of steps representing the optimized route
     */
    @GetMapping("/route")
    @Operation(summary = "Get my route", description = "Fetches the optimized route for the user's orders.")
    public ResponseEntity<List<TspStepDto>> getMyRoute(Authentication auth) {
        return ResponseEntity.ok(ordersService.getKruskalRoute(auth));
    }
}
