package org.team.deliveryplanner.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.team.deliveryplanner.dto.*;
import org.team.deliveryplanner.dto.forms.CreateOrderDto;
import org.team.deliveryplanner.exception.entity.OrderNotFound;
import org.team.deliveryplanner.exception.entity.StatusNotFound;
import org.team.deliveryplanner.exception.Unauthorized;
import org.team.deliveryplanner.exception.forms.UserNotFound;
import org.team.deliveryplanner.entity.Address;
import org.team.deliveryplanner.entity.Order;
import org.team.deliveryplanner.entity.Status;
import org.team.deliveryplanner.entity.User;
import org.team.deliveryplanner.repository.AddressRepository;
import org.team.deliveryplanner.repository.OrderRepository;
import org.team.deliveryplanner.repository.StatusRepository;
import org.team.deliveryplanner.repository.UserRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
/**
 * Manages order creation, retrieval, and status updates for clients, couriers,
 * and admins.
 */
public class OrdersService {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final StatusRepository statusRepository;
    private final AddressRepository addressRepository;

    /**
     * Retrieves orders visible to the authenticated user based on their role.
     *
     * @param auth the authentication object of the current user
     * @return list of OrderDto objects accessible to the user
     * @throws UserNotFound if the authentication name does not match any user
     * @throws Unauthorized if the user's authority cannot be determined
     */
    public List<OrderDto> getMyOrders(Authentication auth) {

        if (auth == null || auth.getName() == null) {
            throw new UserNotFound(auth.getName());
        }

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new UserNotFound(auth.getName()));

        String authority = auth.getAuthorities().stream()
                .findFirst()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .orElseThrow(() -> new Unauthorized());

        List<Order> orders;

        switch (authority) {
            case "admin":
                orders = orderRepository.findAll();
                break;
            case "courier":
                orders = orderRepository.findAllByCourierId(user.getId());
                break;
            case "client":
            default:
                orders = orderRepository.findAllByClientId(user.getId());
                break;
        }

        List<OrderDto> dtos = orders.stream().map(o -> {
            Integer courierId = o.getCourier() != null ? o.getCourier().getId() : null;
            String statusName = o.getStatus() != null ? o.getStatus().getName() : null;

            Address addr = o.getAddress();
            AddressDto addrDto = null;
            if (addr != null) {
                addrDto = new AddressDto(addr.getId(), addr.getLatitude(), addr.getLongitude());
            }

            UserDto courierDto;
            if (o.getCourier() == null) {
                courierDto = new UserDto(null, null, null);
            } else {
                courierDto = new UserDto(o.getCourier().getId(), o.getCourier().getUsername(), null);
            }

            UserDto clientDto;
            if (o.getClient() == null) {
                throw new UserNotFound(auth.getName());
            } else {
                clientDto = new UserDto(o.getClient().getId(), o.getClient().getUsername(), null);
            }

            return new OrderDto(
                    o.getId(),
                    o.getClient().getId(),
                    courierId,
                    o.getDescription(),
                    statusName,
                    addrDto,
                    courierDto,
                    clientDto);

        }).toList();

        return dtos;
    }

    /**
     * Marks a courier's order as done after verifying courier authorization.
     *
     * @param id   the ID of the order to mark as done
     * @param auth the authentication object of the current user
     * @return SimpleResponse indicating the order status update
     * @throws UserNotFound   if the authentication name does not match any user
     * @throws OrderNotFound  if the order ID does not exist
     * @throws Unauthorized   if the user is not the assigned courier
     * @throws StatusNotFound if the 'done' status cannot be found
     */
    public SimpleResponse markOrderDone(Integer id, Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new UserNotFound(auth.getName());
        }

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new UserNotFound(auth.getName()));

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFound(id));

        if (order.getCourier() == null || !order.getCourier().getId().equals(user.getId())) {
            throw new Unauthorized();
        }

        Status doneStatus = statusRepository.findByName("done")
                .orElseThrow(() -> new StatusNotFound("done"));

        order.setStatus(doneStatus);

        orderRepository.save(order);

        return new SimpleResponse("Order marked as done");
    }

    /**
     * Creates a new order with unallocated status for the authenticated client.
     *
     * @param createOrderDto DTO containing order details including location and
     *                       description
     * @param auth           the authentication object of the current user
     * @return SimpleResponse indicating successful creation
     * @throws Unauthorized   if authentication is missing or invalid
     * @throws UserNotFound   if no user matches the authenticated name
     * @throws StatusNotFound if the 'unallocated' status cannot be found
     */
    public SimpleResponse createOrder(CreateOrderDto createOrderDto, Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new Unauthorized();
        }

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new UserNotFound(auth.getName()));

        Status unallocatedStatus = statusRepository.findByName("unallocated")
                .orElseThrow(() -> new StatusNotFound("unallocated"));

        Address address;
        Optional<Address> existingAddress = addressRepository.findByLatitudeAndLongitude(
                createOrderDto.getLatitude(), createOrderDto.getLongitude());

        if (existingAddress.isPresent()) {
            address = existingAddress.get();
        } else {
            address = new Address(createOrderDto.getLatitude(), createOrderDto.getLongitude());
            address = addressRepository.save(address);
        }

        Order order = Order.builder()
                .client(user)
                .description(createOrderDto.getDescription())
                .status(unallocatedStatus)
                .address(address)
                .build();

        orderRepository.save(order);

        return new SimpleResponse("Order created successfully");
    }

    /**
     * Calculates an optimized route for pending orders using Kruskal's MST
     * algorithm.
     *
     * @param auth the authentication object of the current user
     * @return list of TspStepDto representing the optimized delivery route
     * @throws Unauthorized   if authentication is missing or invalid
     * @throws UserNotFound   if no user matches the authenticated name
     * @throws StatusNotFound if the 'done' status cannot be found
     */
    public List<TspStepDto> getKruskalRoute(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new Unauthorized();
        }
        User courier = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new UserNotFound(auth.getName()));

        double startLat = courier.getAddress().getLatitude();
        double startLon = courier.getAddress().getLongitude();

        Status done = statusRepository.findByName("done")
                .orElseThrow(() -> new StatusNotFound("done"));

        List<Order> orders = orderRepository.findAllByCourierId(courier.getId()).stream()
                .filter(o -> !o.getStatus().equals(done))
                .collect(Collectors.toList());

        if (orders.isEmpty()) {
            return Collections.singletonList(
                    new TspStepDto(0, startLat, startLon, 1));
        }

        Map<Integer, double[]> coords = new LinkedHashMap<>();
        coords.put(0, new double[] { startLat, startLon });
        for (Order o : orders) {
            coords.put(o.getId(), new double[] {
                    o.getAddress().getLatitude(),
                    o.getAddress().getLongitude()
            });
        }

        List<Integer> nodes = new ArrayList<>(coords.keySet());

        class Edge {
            int u, v;
            double w;
        }
        List<Edge> edges = new ArrayList<>();
        for (int i = 0; i < nodes.size(); i++) {
            for (int j = i + 1; j < nodes.size(); j++) {
                int u = nodes.get(i), v = nodes.get(j);
                double[] cu = coords.get(u), cv = coords.get(v);
                double d = haversine(cu[0], cu[1], cv[0], cv[1]);
                Edge e = new Edge();
                e.u = u;
                e.v = v;
                e.w = d;
                edges.add(e);
            }
        }

        edges.sort(Comparator.comparingDouble(e -> e.w));
        DSU dsu = new DSU(nodes);

        Map<Integer, List<Integer>> adj = new HashMap<>();
        for (int u : nodes)
            adj.put(u, new ArrayList<>());

        for (Edge e : edges) {
            if (dsu.union(e.u, e.v)) {
                adj.get(e.u).add(e.v);
                adj.get(e.v).add(e.u);
            }
        }

        List<Integer> visitOrder = new ArrayList<>();
        Set<Integer> seen = new HashSet<>();
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(0);
        while (!stack.isEmpty()) {
            int u = stack.pop();
            if (!seen.add(u))
                continue;
            visitOrder.add(u);
            adj.get(u).stream()
                    .sorted(Comparator.reverseOrder())
                    .forEach(stack::push);
        }

        List<TspStepDto> route = new ArrayList<>();
        int step = 1;
        for (int id : visitOrder) {
            double[] c = coords.get(id);
            route.add(new TspStepDto(id, c[0], c[1], step++));
        }
        return route;
    }

    private static class DSU {
        private final Map<Integer, Integer> parent = new HashMap<>();

        public DSU(Collection<Integer> nodes) {
            for (int u : nodes)
                parent.put(u, u);
        }

        public int find(int x) {
            int p = parent.get(x);
            if (p != x) {
                p = find(p);
                parent.put(x, p);
            }
            return p;
        }

        public boolean union(int a, int b) {
            int ra = find(a), rb = find(b);
            if (ra == rb)
                return false;
            parent.put(ra, rb);
            return true;
        }
    }

    /**
     * Calculates the distance on earth between two points.
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
