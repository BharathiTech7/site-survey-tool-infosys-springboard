package com.sitesurvey.auth.service;

import com.sitesurvey.auth.entity.Building;
import com.sitesurvey.auth.entity.Floor;
import com.sitesurvey.auth.repository.BuildingRepository;
import com.sitesurvey.auth.repository.FloorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FloorService {

    private final FloorRepository floorRepository;
    private final BuildingRepository buildingRepository;

    public FloorService(FloorRepository floorRepository,
                        BuildingRepository buildingRepository) {
        this.floorRepository = floorRepository;
        this.buildingRepository = buildingRepository;
    }

    public Floor createFloor(Long buildingId, Floor floor) {

        if (floor.getFloorName() == null || floor.getFloorName().trim().isEmpty()) {
            throw new RuntimeException("Floor name cannot be empty");
        }

        if (floor.getFloorNumber() == null) {
            throw new RuntimeException("Floor number is required");
        }

        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new RuntimeException("Building not found"));

        floor.setBuilding(building);
        return floorRepository.save(floor);
    }


    public List<Floor> getFloorsByBuilding(Long buildingId) {
        return floorRepository.findByBuildingId(buildingId);
    }
}
