package org.team.deliveryplanner.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents an address with latitude and longitude.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "address")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    /**
     * Constructs an Address with the specified latitude and longitude.
     *
     * @param latitude  the latitude of the address
     * @param longitude the longitude of the address
     */
    public Address(Double latitude, Double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
