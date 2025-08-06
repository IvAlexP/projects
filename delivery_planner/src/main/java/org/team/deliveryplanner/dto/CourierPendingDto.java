package org.team.deliveryplanner.dto;

/**
 * DTO for representing a courier's pending order count.
 */
public class CourierPendingDto {
    private Integer courierId;
    private String courierUsername;
    private Long pendingCount;

    public CourierPendingDto(Integer courierId, String courierUsername, Long pendingCount) {
        this.courierId = courierId;
        this.courierUsername = courierUsername;
        this.pendingCount = pendingCount;
    }

    public Integer getCourierId() {
        return courierId;
    }

    public void setCourierId(Integer courierId) {
        this.courierId = courierId;
    }

    public String getCourierUsername() {
        return courierUsername;
    }

    public void setCourierUsername(String courierUsername) {
        this.courierUsername = courierUsername;
    }

    public Long getPendingCount() {
        return pendingCount;
    }

    public void setPendingCount(Long pendingCount) {
        this.pendingCount = pendingCount;
    }
}
