package com.sitesurvey.auth.controller;

import com.sitesurvey.auth.entity.Floor;
import com.sitesurvey.auth.repository.FloorRepository;
import com.sitesurvey.auth.service.FileStorageService;
import com.sitesurvey.auth.service.FloorService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/floors")
public class FloorController {

    private final FloorService floorService;
    private final FileStorageService fileStorageService;
    private final FloorRepository floorRepository;

    // ✅ ONE constructor only
    public FloorController(FloorService floorService,
                           FileStorageService fileStorageService,
                           FloorRepository floorRepository) {
        this.floorService = floorService;
        this.fileStorageService = fileStorageService;
        this.floorRepository = floorRepository;
    }

    // ---------------- FLOOR APIs ----------------

    @PostMapping("/building/{buildingId}")
    public Floor createFloor(@PathVariable Long buildingId,
                             @RequestBody Floor floor) {
        return floorService.createFloor(buildingId, floor);
    }

    @GetMapping("/building/{buildingId}")
    public List<Floor> getFloors(@PathVariable Long buildingId) {
        return floorService.getFloorsByBuilding(buildingId);
    }

    // ---------------- FLOOR PLAN UPLOAD ----------------

    @PostMapping(
    	    value = "/upload-plan/{floorId}",
    	    consumes = "multipart/form-data"
    	)
    	public String uploadFloorPlan(
    	        @PathVariable Long floorId,
    	        @RequestParam("file") MultipartFile file
    	) throws IOException {

    	    if (file == null || file.isEmpty()) {
    	        throw new RuntimeException("File is missing");
    	    }

    	    Floor floor = floorRepository.findById(floorId)
    	            .orElseThrow(() -> new RuntimeException("Floor not found"));

    	    String filePath = fileStorageService.saveFloorPlan(file);
    	    floor.setFloorPlanPath(filePath);

    	    floorRepository.save(floor);

    	    return "Floor plan uploaded successfully";
    	}

    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Floor updateFloor(@PathVariable Long id, @RequestBody Floor updated) {
        Floor floor = floorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Floor not found"));

        floor.setFloorName(updated.getFloorName());
        floor.setFloorNumber(updated.getFloorNumber());

        return floorRepository.save(floor);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteFloor(@PathVariable Long id) {
        floorRepository.deleteById(id);
    }

}
