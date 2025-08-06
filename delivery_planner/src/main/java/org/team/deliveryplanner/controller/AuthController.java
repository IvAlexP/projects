package org.team.deliveryplanner.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.team.deliveryplanner.dto.forms.AuthResponse;
import org.team.deliveryplanner.dto.forms.LoginForm;
import org.team.deliveryplanner.dto.forms.RegisterForm;
import org.team.deliveryplanner.service.AuthService;
import org.team.deliveryplanner.service.UserService;

import io.swagger.v3.oas.annotations.Operation;

/**
 * Controller for managing authentication and registration operations.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private final UserService userService;
    @Autowired
    private final AuthService authService;
    /**
     * Constructs an AuthController with the specified services.
     * @param userService the user service
     * @param authService the authentication service
     */
    public AuthController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    /**
     * Authenticates a user and generates a JWT token.
     * @param form the login form containing username and password
     * @return an authentication response containing the JWT token
     */
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates a user and generates a JWT token.")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginForm form) {
        return ResponseEntity.ok(authService.authenticateAndGenerateToken(form));
    }

    /**
     * Registers a new user in the system.
     * @param form the registration form containing user details
     * @return a response indicating the success of the registration
     */
    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Registers a new user in the system.")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterForm form) {
        return ResponseEntity.ok(authService.registerNewUser(form));
    }
}
