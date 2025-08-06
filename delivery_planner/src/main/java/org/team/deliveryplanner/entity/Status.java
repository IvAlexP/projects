package org.team.deliveryplanner.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents the status of an order in the system.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "status")
public class Status {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String name;

    /**
     * Constructs a Status with the specified name.
     * @param name the name of the status
     */
    public Status(String name) {
        this.name = name;
    }
}
