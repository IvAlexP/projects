package org.team.deliveryplanner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.team.deliveryplanner.entity.Status;

import java.util.Optional;

/**
 * Repository interface for Status entity operations.
 */
public interface StatusRepository extends JpaRepository<Status, Integer> {
    /**
     * Finds a status by its name.
     * @param name the name of the status
     * @return an Optional containing the Status if found, or empty otherwise
     */
    Optional<Status> findByName(String name);
}
