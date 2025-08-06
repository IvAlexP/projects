package org.team.deliveryplanner.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.team.deliveryplanner.dto.*;
import org.team.deliveryplanner.dto.forms.RoleChangeDto;
import org.team.deliveryplanner.exception.entity.*;
import org.team.deliveryplanner.exception.forms.UserNotFound;
import org.team.deliveryplanner.exception.forms.ValidationException;
import org.team.deliveryplanner.entity.Address;
import org.team.deliveryplanner.entity.Order;
import org.team.deliveryplanner.entity.Role;
import org.team.deliveryplanner.entity.Status;
import org.team.deliveryplanner.entity.User;
import org.team.deliveryplanner.repository.*;

import java.util.*;
import java.util.stream.Collectors;

@Service
/**
 * Provides administrative operations for managing users, roles and orders.
 */
public class AdminService {
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final OrderRepository orderRepo;
    private final AddressRepository addressRepo;
    private final StatusRepository statusRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public AdminService(UserRepository userRepo, RoleRepository roleRepo, OrderRepository orderRepo,
            AddressRepository addressRepo, StatusRepository statusRepository) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.orderRepo = orderRepo;
        this.addressRepo = addressRepo;
        this.statusRepository = statusRepository;
    }

    /**
     * Retrieves a list of all users with their ID, username, and roles.
     *
     * @return list of UserInfoDto representing all users
     */
    public List<UserInfoDto> getAllUsers() {
        return userRepo.findAll().stream()
                .map(user -> {
                    Set<String> roleNames = user.getRoles().stream()
                            .map(Role::getName)
                            .collect(Collectors.toSet());
                    return new UserInfoDto(user.getId(), user.getUsername(), roleNames);
                })
                .collect(Collectors.toList());
    }

    /**
     * Deletes a user and reassigns or removes their related orders and address
     * entities.
     *
     * @param userId the ID of the user to delete
     * @return SimpleResponse indicating result of deletion
     * @throws UserNotFound   if the user does not exist
     * @throws StatusNotFound if required status values are missing
     */
    @Transactional
    public SimpleResponse deleteUser(Integer userId) {
        if (!userRepo.existsById(userId)) {
            throw new UserNotFound(userId);
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFound(userId));

        Address userAddress = user.getAddress();

        orderRepo.deleteAllByClientId(userId);

        Status unallocatedStatus = statusRepository.findByName("unallocated")
                .orElseThrow(() -> new StatusNotFound("unallocated"));

        Status doneStatus = statusRepository.findByName("done")
                .orElseThrow(() -> new StatusNotFound("done"));

        List<Order> courierOrders = orderRepo.findAllByCourierId(userId);

        for (Order order : courierOrders) {
            if (order.getStatus().equals(doneStatus)) {
                orderRepo.delete(order);
            } else {
                order.setCourier(null);
                order.setStatus(unallocatedStatus);
                orderRepo.save(order);
            }
        }

        entityManager.flush();
        entityManager.clear();

        user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFound(userId));

        user.setRoles(new HashSet<>());
        user.setAddress(null);
        userRepo.save(user);

        entityManager.flush();

        userRepo.delete(user);
        entityManager.flush();

        if (userAddress != null) {
            boolean addressInUse = userRepo.findAll().stream()
                    .anyMatch(u -> u.getAddress() != null && u.getAddress().getId().equals(userAddress.getId()));

            if (!addressInUse) {
                addressInUse = orderRepo.findAll().stream()
                        .anyMatch(o -> o.getAddress() != null && o.getAddress().getId().equals(userAddress.getId()));
            }

            if (!addressInUse) {
                addressRepo.delete(userAddress);
            }
        }

        return new SimpleResponse("User deleted successfully");
    }

    /**
     * Adds a specified role to a user if not already assigned.
     *
     * @param dto the DTO containing userId and roleName to add
     * @return SimpleResponse indicating success
     * @throws UserNotFound      if the user does not exist
     * @throws RoleNotFound      if the role does not exist
     * @throws RoleAlreadyExists if the user already has the role
     */
    public SimpleResponse addRoleToUser(RoleChangeDto dto) {
        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new UserNotFound(dto.getUserId()));
        Role role = roleRepo.findByName(dto.getRoleName().toLowerCase())
                .orElseThrow(() -> new RoleNotFound(dto.getRoleName()));

        if (user.getRoles().stream().map(Role::getName).anyMatch(rn -> rn.equalsIgnoreCase(role.getName()))) {
            throw new RoleAlreadyExists(dto.getRoleName());
        }
        user.getRoles().add(role);
        userRepo.save(user);

        return new SimpleResponse("Role added successfully");
    }

    /**
     * Removes a specified role from a user, throwing if the role is not present.
     *
     * @param dto the DTO containing userId and roleName to remove
     * @return SimpleResponse indicating success
     * @throws UserNotFound        if the user does not exist
     * @throws RoleNotFound        if the role does not exist
     * @throws UserDoesNotHaveRole if the user does not have the given role
     */
    @Transactional
    public SimpleResponse removeRoleFromUser(RoleChangeDto dto) {
        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new UserNotFound(dto.getUserId()));

        Role role = roleRepo.findByName(dto.getRoleName().toLowerCase())
                .orElseThrow(() -> new RoleNotFound(dto.getRoleName()));

        boolean removed = user.getRoles().removeIf(r -> r.getName().equalsIgnoreCase(role.getName()));
        if (removed) {
            userRepo.save(user);
        } else {
            throw new UserDoesNotHaveRole(user.getId(), dto.getRoleName());
        }
        return new SimpleResponse("Role removed successfully");
    }

    /**
     * Retrieves couriers along with their count of pending orders.
     *
     * @return list of CourierPendingDto for couriers and their pending order counts
     */
    @Transactional
    public List<CourierPendingDto> getCouriersWithPendingCount() {
        return userRepo.getCouriersWithPendingCount();
    }

    /**
     * Allocates the nearest unallocated orders to a given courier up to the
     * specified limit.
     *
     * @param courierId the ID of the courier to assign orders to
     * @param numOrders the maximum number of orders to allocate
     * @return SimpleResponse indicating how many orders were assigned
     * @throws UserNotFound              if the courier does not exist
     * @throws StatusNotFound            if required status values are missing
     * @throws CourierDoesNotHaveAddress if the courier has no address set
     * @throws ValidationException       if not enough unallocated orders are
     *                                   available
     */
    public SimpleResponse allocateNearestOrders(Integer courierId, Integer numOrders) {
        User courier = userRepo.findById(courierId)
                .orElseThrow(() -> new UserNotFound(courierId));
        Status unalloc = statusRepository.findByName("unallocated")
                .orElseThrow(() -> new StatusNotFound("unallocated"));
        Status pending = statusRepository.findByName("pending")
                .orElseThrow(() -> new StatusNotFound("pending"));

        if (courier.getAddress() == null) {
            throw new CourierDoesNotHaveAddress(courierId);
        }

        double curLat = courier.getAddress().getLatitude();
        double curLon = courier.getAddress().getLongitude();

        List<Order> candidates = orderRepo.findAll().stream()
                .filter(o -> o.getCourier() == null && o.getStatus().equals(unalloc))
                .collect(Collectors.toList());

        if (candidates.size() < numOrders) {
            throw new ValidationException("Not enough unallocated orders available");
        }

        candidates.sort(Comparator.comparingDouble(o -> haversine(curLat, curLon,
                o.getAddress().getLatitude(), o.getAddress().getLongitude())));

        int limit = Math.min(numOrders, candidates.size());
        for (int i = 0; i < limit; i++) {
            Order o = candidates.get(i);
            o.setCourier(courier);
            o.setStatus(pending);
            orderRepo.save(o);
        }

        return new SimpleResponse("Assigned " + limit + " orders to courier with ID " + courierId);
    }

    /**
     * Returns the total number of orders currently unassigned.
     *
     * @return number of unallocated orders
     * @throws StatusNotFound if the unallocated status value is missing
     */
    public Integer getUnassignedOrdersCount() {
        Status unallocatedStatus = statusRepository.findByName("unallocated")
                .orElseThrow(() -> new StatusNotFound("unallocated"));
        return orderRepo.countByStatus(unallocatedStatus);
    }

    /**
     * Calculates distance between two geographic coordinates using the Haversine
     * formula.
     *
     * @param lat1 latitude of the first point
     * @param lon1 longitude of the first point
     * @param lat2 latitude of the second point
     * @param lon2 longitude of the second point
     * @return distance in kilometers between two points
     */
    private static double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
