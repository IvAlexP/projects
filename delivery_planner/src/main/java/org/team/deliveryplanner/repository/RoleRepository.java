package org.team.deliveryplanner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.team.deliveryplanner.entity.Role;

import java.util.Optional;

/**
 * Repository interface for Role entity operations.
 */
public interface RoleRepository extends JpaRepository<Role, Integer> {
    /**
     * Finds a role by its name.
     * @param name the name of the role
     * @return an Optional containing the Role if found, or empty otherwise
     */
    Optional<Role> findByName(String name);
}
