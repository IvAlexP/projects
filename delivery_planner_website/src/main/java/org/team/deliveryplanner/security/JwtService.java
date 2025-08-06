package org.team.deliveryplanner.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

/**
 * Service for handling JWT creation, validation and extraction of claims.
 */
@Service
public class JwtService {
    private Key jwtSecret;
    private final long jwtExpirationMs = 24 * 60 * 60 * 1000; // 24h

    @Value("${jwt.secret}")
    private String secret;

    /**
     * Initializes the JWT secret key after bean construction.
     */
    @PostConstruct
    public void init() {
        jwtSecret = Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Generates a JWT token for the given username and role.
     *
     * @param username the username to include in the token
     * @param role     the role to include in the token
     * @return a signed JWT token string
     */
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(jwtSecret)
                .compact();
    }

    /**
     * Extracts the username from a JWT token.
     *
     * @param token the JWT token
     * @return the username contained in the token
     * @throws io.jsonwebtoken.JwtException if the token is invalid
     */
    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Validates a JWT token.
     *
     * @param token the JWT token to validate
     * @return true if the token is valid, false otherwise
     */
    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Extracts the role from a JWT token.
     *
     * @param jwt the JWT token
     * @return the role contained in the token or null if invalid
     */
    public String extractRole(String jwt) {
        try {
            Claims claims = parseClaims(jwt);
            return claims.get("role", String.class);
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
