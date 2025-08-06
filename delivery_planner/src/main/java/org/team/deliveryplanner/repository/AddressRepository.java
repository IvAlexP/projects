package org.team.deliveryplanner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.team.deliveryplanner.entity.Address;

import java.util.Optional;

/**
 * Repository interface for Address entity operations.
 */
public interface AddressRepository extends JpaRepository<Address, Long> {
    /**
     * Finds an address by latitude and longitude.
     * @param latitude the latitude of the address
     * @param longitude the longitude of the address
     * @return an Optional containing the Address if found, or empty otherwise
     */
    Optional<Address> findByLatitudeAndLongitude(Double latitude, Double longitude);
}
