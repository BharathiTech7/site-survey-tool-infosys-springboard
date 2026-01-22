package com.sitesurvey.auth.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "floors")
public class Floor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String floorName;
    private Integer floorNumber;

    @ManyToOne
    @JoinColumn(name = "building_id", nullable = false)
    private Building building;
    
    @Column(name = "floor_plan_path")
    private String floorPlanPath;

    public String getFloorPlanPath() {
        return floorPlanPath;
    }

    public void setFloorPlanPath(String floorPlanPath) {
        this.floorPlanPath = floorPlanPath;
    }

    
    public Long getId() {
        return id;
    }

    public String getFloorName() {
        return floorName;
    }

    public void setFloorName(String floorName) {
        this.floorName = floorName;
    }

    public Integer getFloorNumber() {
        return floorNumber;
    }

    public void setFloorNumber(Integer floorNumber) {
        this.floorNumber = floorNumber;
    }

    public Building getBuilding() {
        return building;
    }

    public void setBuilding(Building building) {
        this.building = building;
    }
}
