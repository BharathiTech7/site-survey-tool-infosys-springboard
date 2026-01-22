package com.sitesurvey.auth.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.sitesurvey.auth.entity.Building;
import com.sitesurvey.auth.service.BuildingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/buildings")
public class BuildingController {

    private final BuildingService buildingService;

    public BuildingController(BuildingService buildingService) {
        this.buildingService = buildingService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/property/{propertyId}")
    public ResponseEntity<Building> createBuilding(
            @PathVariable Long propertyId,
            @Valid @RequestBody Building building
) {

        return ResponseEntity.ok(
                buildingService.createBuilding(propertyId, building)
        );
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Building>> getBuildings(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                buildingService.getBuildingsByProperty(propertyId)
        );
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Building> updateBuilding(
            @PathVariable Long id,
            @RequestBody Building building) {

        return ResponseEntity.ok(
                buildingService.updateBuilding(id, building)
        );
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBuilding(@PathVariable Long id) {
        buildingService.deleteBuilding(id);
        return ResponseEntity.noContent().build();
    }

}
