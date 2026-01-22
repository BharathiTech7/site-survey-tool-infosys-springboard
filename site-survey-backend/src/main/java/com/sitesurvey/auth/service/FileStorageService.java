package com.sitesurvey.auth.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {

    private final String uploadDir = "uploads/floor-plans";

    public String saveFloorPlan(MultipartFile file) throws IOException {

        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String filePath = uploadDir + "/" + System.currentTimeMillis()
                + "_" + file.getOriginalFilename();

        Path path = Paths.get(filePath);
        Files.write(path, file.getBytes());

        return filePath;
    }
}
