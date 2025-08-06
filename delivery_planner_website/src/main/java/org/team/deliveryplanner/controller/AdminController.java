package org.team.deliveryplanner.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.team.deliveryplanner.dto.*;
import org.team.deliveryplanner.dto.forms.RoleChangeDto;
import org.team.deliveryplanner.service.AdminService;

import java.util.List;

/**
 * Controller for managing administrative operations.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('admin')")
public class AdminController {
    private final AdminService adminService;

    /**
     * Constructs an AdminController with the specified service.
     * @param adminService the administrative service
     */
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * Retrieves all user accounts in the system.
     * @return a list of user accounts
     */
    @GetMapping("/accounts")
    @Operation(summary = "Get all accounts", description = "Fetches all user accounts in the system.")
    public ResponseEntity<List<UserInfoDto>> getAllAccounts() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    /**
     * Deletes a user account by ID.
     * @param userId the ID of the user to delete
     * @return a response indicating the success of the deletion
     */
    @DeleteMapping("/accounts/{userId}")
    @Operation(summary = "Delete user account", description = "Deletes a user account by ID.")
    public ResponseEntity<SimpleResponse> deleteAccount(@PathVariable Integer userId) {
        return ResponseEntity.ok(adminService.deleteUser(userId));
    }

    /**
     * Adds a role to a user account.
     * @param dto the role change details
     * @return a response indicating the success of the operation
     */
    @PostMapping("/accounts/add-role")
    @Operation(summary = "Add role to user", description = "Adds a role to a user account.")
    public ResponseEntity<SimpleResponse> addRole(@Valid @RequestBody RoleChangeDto dto) {
        return ResponseEntity.ok(adminService.addRoleToUser(dto));
    }

    /**
     * Removes a role from a user account.
     * @param dto the role change details
     * @return a response indicating the success of the operation
     */
    @PostMapping("/accounts/remove-role")
    @Operation(summary = "Remove role from user", description = "Removes a role from a user account.")
    public ResponseEntity<SimpleResponse> removeRole(@Valid @RequestBody RoleChangeDto dto) {
        return ResponseEntity.ok(adminService.removeRoleFromUser(dto));
    }

    /**
     * Retrieves couriers with pending orders.
     * @return a list of couriers with their pending order counts
     */
    @GetMapping("/couriers/pending")
    @Operation(summary = "Get couriers with pending orders", description = "Fetches couriers with their pending order counts.")
    public ResponseEntity<List<CourierPendingDto>> getCouriersPending() {
        return ResponseEntity.ok(adminService.getCouriersWithPendingCount());
    }

    /**
     * Assigns orders to a courier.
     * @param dto the order assignment details
     * @return a response indicating the success of the operation
     */
    @PostMapping("/couriers/assign")
    @Operation(summary = "Assign orders to courier", description = "Assigns orders to a courier.")
    public ResponseEntity<SimpleResponse> assignOrders(@Valid @RequestBody AssignOrdersDto dto) {
        return ResponseEntity.ok(adminService.allocateNearestOrders(dto.getCourierId(), dto.getNumOrders()));
    }

    /**
     * Retrieves the count of unassigned orders.
     * @return the count of unassigned orders
     */
    @GetMapping("/orders/unassigned/count")
    @Operation(summary = "Get unassigned orders count", description = "Fetches the count of unassigned orders.")
    public ResponseEntity<Integer> getUnassignedOrdersCount() {
        return ResponseEntity.ok(adminService.getUnassignedOrdersCount());
    }
}
