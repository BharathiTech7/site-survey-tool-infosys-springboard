package com.sitesurvey.auth.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sitesurvey.auth.entity.Building;
import com.sitesurvey.auth.entity.Property;
import com.sitesurvey.auth.repository.BuildingRepository;
import com.sitesurvey.auth.repository.PropertyRepository;

@Service
public class BuildingService {

    private final BuildingRepository buildingRepository;
    private final PropertyRepository propertyRepository;

    public BuildingService(BuildingRepository buildingRepository,
                           PropertyRepository propertyRepository) {
        this.buildingRepository = buildingRepository;
        this.propertyRepository = propertyRepository;
    }

    public Building createBuilding(Long propertyId, Building building) {

        // 🔒 BUSINESS VALIDATION
        if (building.getName() == null || building.getName().trim().isEmpty()) {
            throw new RuntimeException("Building name cannot be empty");
        }

        if (building.getCode() == null || building.getCode().trim().isEmpty()) {
            throw new RuntimeException("Building code cannot be empty");
        }

        if (building.getFloorsCount() == null || building.getFloorsCount() < 1) {
            throw new RuntimeException("Floors count must be at least 1");
        }

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        building.setProperty(property);
        return buildingRepository.save(building);
    }

    public List<Building> getBuildingsByProperty(Long propertyId) {
        return buildingRepository.findByPropertyId(propertyId);
    }

    public Building updateBuilding(Long id, Building updatedBuilding) {

        Building existing = buildingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Building not found"));

        // 🔒 SAME VALIDATION FOR UPDATE
        if (updatedBuilding.getName() == null || updatedBuilding.getName().trim().isEmpty()) {
            throw new RuntimeException("Building name cannot be empty");
        }

        if (updatedBuilding.getCode() == null || updatedBuilding.getCode().trim().isEmpty()) {
            throw new RuntimeException("Building code cannot be empty");
        }

        if (updatedBuilding.getFloorsCount() == null || updatedBuilding.getFloorsCount() < 1) {
            throw new RuntimeException("Floors count must be at least 1");
        }

        existing.setName(updatedBuilding.getName());
        existing.setCode(updatedBuilding.getCode());
        existing.setFloorsCount(updatedBuilding.getFloorsCount());

        return buildingRepository.save(existing);
    }

    public void deleteBuilding(Long id) {
        buildingRepository.deleteById(id);
    }
}
