package com.sitesurvey.auth.controller;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

import com.sitesurvey.auth.entity.Space;
import com.sitesurvey.auth.service.SpaceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/spaces")
public class SpaceController {

    private final SpaceService spaceService;

    public SpaceController(SpaceService spaceService) {
        this.spaceService = spaceService;
    }

    @PostMapping("/floor/{floorId}")
    public Space createSpace(
            @PathVariable Long floorId,
            @Valid @RequestBody Space space   // 👈 THIS IS CRITICAL
    ) {
        return spaceService.createSpace(floorId, space);
    }

    @GetMapping("/floor/{floorId}")
    public List<Space> getSpaces(@PathVariable Long floorId) {
        return spaceService.getSpacesByFloor(floorId);
    }
    
    @PostMapping("/import/floor/{floorId}")
    public ResponseEntity<String> importSpacesFromCsv(
            @PathVariable Long floorId,
            @RequestParam("file") MultipartFile file) {

        spaceService.importSpacesFromCsv(floorId, file);
        return ResponseEntity.ok("Spaces imported successfully");
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpace(@PathVariable Long id) {
        spaceService.deleteSpace(id);
        return ResponseEntity.noContent().build();
    }


}
