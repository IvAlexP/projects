package org.team.deliveryplanner.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents a role assigned to a user in the system.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String name;

    /**
     * Constructs a Role with the specified name.
     * @param name the name of the role
     */
    public Role(String name) {
        this.name = name;
    }
}
