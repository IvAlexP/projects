package org.team.deliveryplanner.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.team.deliveryplanner.dto.forms.RegisterForm;
import org.team.deliveryplanner.dto.forms.AuthResponse;
import org.team.deliveryplanner.dto.forms.LoginForm;
import org.team.deliveryplanner.dto.SimpleResponse;
import org.team.deliveryplanner.exception.forms.UserAlreadyExistsException;
import org.team.deliveryplanner.exception.forms.UserNotFound;
import org.team.deliveryplanner.exception.forms.ValidationException;
import org.team.deliveryplanner.exception.forms.WrongPassword;
import org.team.deliveryplanner.entity.User;
import org.team.deliveryplanner.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.team.deliveryplanner.security.JwtService;

/**
 * Handles user login by validating credentials and issuing JWT tokens.
 * Also manages new user registration with secure password encoding.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Authenticates a user and generates a JWT token for the specified role.
     * Validates credentials and verifies role membership before token issuance.
     *
     * @param loginForm the login credentials and desired role
     * @return AuthResponse containing the generated JWT token
     * @throws UserNotFound        if the username does not exist
     * @throws WrongPassword       if the password does not match
     * @throws ValidationException if the user does not have the selected role
     */
    public AuthResponse authenticateAndGenerateToken(LoginForm loginForm) {

        User user = userRepository.findByUsername(loginForm.getUsername())
                .orElseThrow(() -> new UserNotFound(loginForm.getUsername()));

        if (!passwordEncoder.matches(loginForm.getPassword(), user.getPasswordHash())) {
            throw new WrongPassword();
        }

        boolean hasRole = user.getRoles().stream()
                .anyMatch(role -> role.getName().toLowerCase().contains(loginForm.getRole().toLowerCase()));

        if (!hasRole) {
            throw new ValidationException("User does not have the selected role");
        }

        String token = jwtService.generateToken(user.getUsername(), loginForm.getRole());

        return AuthResponse.builder()
                .accessToken(token)
                .build();
    }

    /**
     * Registers a new user with encoded password and saves them to the repository.
     * Throws an exception if the username already exists.
     *
     * @param registerForm the registration form with username and password
     * @return SimpleResponse indicating successful registration
     * @throws UserAlreadyExistsException if the username already exists
     */
    public SimpleResponse registerNewUser(RegisterForm registerForm) {
        if (userRepository.existsByUsername(registerForm.getUsername())) {
            throw new UserAlreadyExistsException(registerForm.getUsername());
        }

        User user = User.builder()
                .username(registerForm.getUsername())
                .passwordHash(passwordEncoder.encode(registerForm.getPassword()))
                .build();

        userRepository.save(user);

        return new SimpleResponse("User registered successfully");
    }
}
