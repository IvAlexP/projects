package org.team.deliveryplanner.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.team.deliveryplanner.dto.UserDto;
import org.team.deliveryplanner.dto.forms.CreateAddressDto;
import org.team.deliveryplanner.dto.SimpleResponse;
import org.team.deliveryplanner.dto.UserProfileDto;
import org.team.deliveryplanner.entity.User;
import org.team.deliveryplanner.repository.AddressRepository;
import org.team.deliveryplanner.repository.UserRepository;
import org.team.deliveryplanner.service.UserService;
import io.swagger.v3.oas.annotations.Operation;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Controller for managing user-related operations.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final UserService userService;

    /**
     * Constructs a UserController with the specified dependencies.
     * @param userRepository the user repository
     * @param addressRepository the address repository
     * @param userService the user service
     */
    public UserController(UserRepository userRepository,
                          AddressRepository addressRepository, UserService userService) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.userService = userService;
    }

    /**
     * Retrieves the profile of the currently authenticated user.
     * @param auth the authentication object of the current user
     * @return the profile of the authenticated user
     */
    @GetMapping("/me")
    @Operation(summary = "Get user profile", description = "Fetches the profile of the currently authenticated user.")
    public ResponseEntity<UserProfileDto> getMyProfile(Authentication auth) {
        return ResponseEntity.ok(userService.getProfile(auth));
    }

    /**
     * Updates the personal address of the currently authenticated user.
     * @param createAddressDto the new address details
     * @param auth the authentication object of the current user
     * @return a response indicating the success of the update
     */
    @PutMapping("/me/address")
    @Operation(summary = "Update user address", description = "Updates the personal address of the authenticated user.")
    public ResponseEntity<SimpleResponse> updatePersonalAddress(@Valid @RequestBody CreateAddressDto createAddressDto, Authentication auth) {
        return ResponseEntity.ok(userService.updatePersonalAddress(createAddressDto, auth));
    }

    @GetMapping("/user")
    public ResponseEntity<UserDto> getUser(Authentication auth) {
        return ResponseEntity.ok(userService.getUser(auth));
    }
}
