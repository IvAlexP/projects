package org.team.deliveryplanner.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.team.deliveryplanner.entity.Order;
import org.team.deliveryplanner.entity.Status;

import java.util.List;

/**
 * Repository interface for Order entity operations.
 */
public interface OrderRepository extends JpaRepository<Order, Integer> {
    /**
     * Finds all orders by client ID.
     * @param clientId the client ID
     * @return a list of orders for the given client
     */
    List<Order> findAllByClientId(Integer clientId);

    /**
     * Finds all orders by courier ID.
     * @param id the courier ID
     * @return a list of orders for the given courier
     */
    List<Order> findAllByCourierId(Integer id);

    /**
     * Deletes all orders by client ID.
     * @param userId the client ID whose orders will be deleted
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM Order o WHERE o.client.id = :userId")
    void deleteAllByClientId(Integer userId);

    /**
     * Counts the number of orders with a specific status.
     * @param unallocatedStatus the status to count by
     * @return the number of orders with the given status
     */
    @Query("SELECT count(o) FROM Order o WHERE o.status = :unallocatedStatus")
    Integer countByStatus(Status unallocatedStatus);
}
