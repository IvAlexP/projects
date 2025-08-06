package org.team.deliveryplanner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.team.deliveryplanner.dto.CourierPendingDto;
import org.team.deliveryplanner.entity.User;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity operations.
 */
public interface UserRepository extends JpaRepository<User, Integer> {
    /**
     * Finds a user by username.
     * @param username the username to search for
     * @return an Optional containing the User if found or empty otherwise
     */
    Optional<User> findByUsername(String username);

    /**
     * Checks if a user exists by username.
     * @param username the username to check
     * @return true if a user with the given username exists, false otherwise
     */
    boolean existsByUsername(String username);

    /**
     * Retrieves a list of couriers with their count of pending orders.
     * @return a list of CourierPendingDto objects containing courier info and pending order count
     */
    @Query("""
        SELECT new org.team.deliveryplanner.dto.CourierPendingDto(
          u.id,
          u.username,
          COUNT(o.id)
        )
        FROM User u
        JOIN u.roles r
        LEFT JOIN Order o 
          ON o.courier.id = u.id 
          AND o.status.name = 'pending'
        WHERE r.name = 'courier'
        GROUP BY u.id, u.username
        ORDER BY u.id
    """)
    List<CourierPendingDto> getCouriersWithPendingCount();

    /**
     * Deletes a user by their ID.
     * @param id the ID of the user to delete
     */
    @Query("DELETE FROM User u WHERE u.id = ?1")
    void deleteById(Integer id);
}
