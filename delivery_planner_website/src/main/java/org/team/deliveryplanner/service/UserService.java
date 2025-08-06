package org.team.deliveryplanner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.team.deliveryplanner.dto.*;
import org.team.deliveryplanner.dto.forms.CreateAddressDto;
import org.team.deliveryplanner.exception.Unauthorized;
import org.team.deliveryplanner.exception.forms.UserNotFound;
import org.team.deliveryplanner.entity.Address;
import org.team.deliveryplanner.entity.Role;
import org.team.deliveryplanner.entity.User;
import org.team.deliveryplanner.exception.forms.ValidationException;
import org.team.deliveryplanner.repository.AddressRepository;
import org.team.deliveryplanner.repository.RoleRepository;
import org.team.deliveryplanner.repository.UserRepository;
import org.team.deliveryplanner.security.JwtService;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
/**
 * Provides operations for retrieving user profile and managing personal
 * address.
 */
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private AddressRepository addressRepository;

    /**
     * Retrieves the authenticated user's profile including roles and address if
     * present.
     *
     * @param auth the authentication object representing the user
     * @return UserProfileDto containing user ID, username, roles, and address
     * @throws Unauthorized if authentication is missing or invalid
     * @throws UserNotFound if no user matches the authenticated username
     */
    public UserProfileDto getProfile(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new Unauthorized();
        }

        User user = userRepo.findByUsername(auth.getName())
                .orElseThrow(() -> new UserNotFound("User not found"));

        Set<String> roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        Address address = user.getAddress();
        AddressDto addressDto = null;
        if (address != null) {
            addressDto = new AddressDto(address.getId(), address.getLatitude(), address.getLongitude());
        }
        return new UserProfileDto(
                user.getId(),
                user.getUsername(),
                roles,
                addressDto);
    }

    /**
     * Updates or creates the authenticated user's personal address.
     *
     * @param createAddressDto DTO containing latitude and longitude for new address
     * @param auth             the authentication object representing the user
     * @return SimpleResponse with success message
     * @throws Unauthorized if authentication is missing or invalid
     * @throws UserNotFound if no user matches the authenticated username
     */
    public SimpleResponse updatePersonalAddress(CreateAddressDto createAddressDto, Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new Unauthorized();
        }

        User user = userRepo.findByUsername(auth.getName())
                .orElseThrow(() -> new UserNotFound("User not found"));

        Address address;
        Optional<Address> existingAddress = addressRepository.findByLatitudeAndLongitude(
                createAddressDto.getLatitude(), createAddressDto.getLongitude());

        if (existingAddress.isPresent()) {
            address = existingAddress.get();
        } else {
            address = new Address(createAddressDto.getLatitude(), createAddressDto.getLongitude());
            address = addressRepository.save(address);
        }

        user.setAddress(address);
        userRepo.save(user);

        return new SimpleResponse("Address updated successfully.");
    }

    public UserDto getUser(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new ValidationException("Authentication is required");
        }

        String username = auth.getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFound(username));

        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new UserDto(user.getId(), user.getUsername(), roleNames);
    }
}
