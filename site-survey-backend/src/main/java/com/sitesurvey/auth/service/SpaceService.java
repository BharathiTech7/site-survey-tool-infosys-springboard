package com.sitesurvey.auth.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;

import com.sitesurvey.auth.entity.Floor;
import com.sitesurvey.auth.entity.Space;
import com.sitesurvey.auth.repository.FloorRepository;
import com.sitesurvey.auth.repository.SpaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpaceService {

    private final SpaceRepository spaceRepository;
    private final FloorRepository floorRepository;

    public SpaceService(SpaceRepository spaceRepository,
                        FloorRepository floorRepository) {
        this.spaceRepository = spaceRepository;
        this.floorRepository = floorRepository;
    }

    // ============================
    // CREATE SINGLE SPACE
    // ============================
    public Space createSpace(Long floorId, Space space) {

        // 🔒 VALIDATION (NO EMPTY VALUES)
        if (space.getSpaceName() == null || space.getSpaceName().trim().isEmpty()) {
            throw new RuntimeException("Space name cannot be empty");
        }

        if (space.getSpaceType() == null || space.getSpaceType().trim().isEmpty()) {
            throw new RuntimeException("Space type cannot be empty");
        }

        Floor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new RuntimeException("Floor not found"));

        space.setFloor(floor);
        return spaceRepository.save(space);
    }

    // ============================
    // GET SPACES
    // ============================
    public List<Space> getSpacesByFloor(Long floorId) {
        return spaceRepository.findByFloorId(floorId);
    }

    // ============================
    // CSV IMPORT (SAFE VERSION)
    // ============================
    public void importSpacesFromCsv(Long floorId, MultipartFile file) {

        try {
            Floor floor = floorRepository.findById(floorId)
                    .orElseThrow(() -> new RuntimeException("Floor not found"));

            BufferedReader reader =
                    new BufferedReader(new InputStreamReader(file.getInputStream()));

            String line;
            boolean isHeader = true;

            while ((line = reader.readLine()) != null) {

                // skip header row
                if (isHeader) {
                    isHeader = false;
                    continue;
                }

                if (line.trim().isEmpty()) continue;

                String[] values = line.split(",");

                // 🔒 SAFETY CHECK
                if (values.length < 2) continue;

                String spaceName = values[0].trim();
                String spaceType = values[1].trim();

                // 🔒 SKIP INVALID ROWS
                if (spaceName.isEmpty() || spaceType.isEmpty()) continue;

                Space space = new Space();
                space.setSpaceName(spaceName);
                space.setSpaceType(spaceType);
                space.setFloor(floor);

                spaceRepository.save(space);
            }

        } catch (Exception e) {
            throw new RuntimeException("CSV import failed");
        }
    }
    
 // ============================
 // DELETE SPACE
 // ============================
 public void deleteSpace(Long spaceId) {
     if (!spaceRepository.existsById(spaceId)) {
         throw new RuntimeException("Space not found");
     }
     spaceRepository.deleteById(spaceId);
 }

}
