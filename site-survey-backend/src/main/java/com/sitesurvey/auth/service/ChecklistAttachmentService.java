package com.sitesurvey.auth.service;

import com.sitesurvey.auth.entity.ChecklistAttachment;
import com.sitesurvey.auth.entity.ChecklistResponse;
import com.sitesurvey.auth.repository.ChecklistAttachmentRepository;
import com.sitesurvey.auth.repository.ChecklistResponseRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ChecklistAttachmentService {

    private static final String UPLOAD_DIR = "uploads/checklist-attachments/";

    private final ChecklistAttachmentRepository attachmentRepository;
    private final ChecklistResponseRepository responseRepository;

    public ChecklistAttachmentService(
            ChecklistAttachmentRepository attachmentRepository,
            ChecklistResponseRepository responseRepository) {

        this.attachmentRepository = attachmentRepository;
        this.responseRepository = responseRepository;
    }

    // 1️⃣ Upload attachment
    public ChecklistAttachment uploadAttachment(
            Long responseId,
            MultipartFile file) {

        ChecklistResponse response = responseRepository.findById(responseId)
                .orElseThrow(() -> new RuntimeException("Checklist response not found"));

        // 🔒 Block upload after submit
        if ("SUBMITTED".equals(response.getStatus())) {
            throw new RuntimeException("Cannot upload attachment after submission");
        }

        try {
            // Ensure directory exists
            Files.createDirectories(Paths.get(UPLOAD_DIR));

            // Unique filename
            String storedFileName =
                    UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path filePath = Paths.get(UPLOAD_DIR + storedFileName);

            // Write file
            Files.write(filePath, file.getBytes());

            // Save DB record
            ChecklistAttachment attachment = new ChecklistAttachment();
            attachment.setChecklistResponse(response);
            attachment.setFileName(file.getOriginalFilename());
            attachment.setFilePath(filePath.toString());
            attachment.setUploadedAt(LocalDateTime.now());

            return attachmentRepository.save(attachment);

        } catch (Exception e) {
            throw new RuntimeException("File upload failed", e);
        }
    }

    // 2️⃣ Get attachments for a response
    public List<ChecklistAttachment> getAttachmentsByResponse(Long responseId) {
        return attachmentRepository.findByChecklistResponseId(responseId);
    }
}
