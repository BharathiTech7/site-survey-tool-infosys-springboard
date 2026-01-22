package com.sitesurvey.auth.controller;

import com.sitesurvey.auth.entity.ChecklistAttachment;
import com.sitesurvey.auth.service.ChecklistAttachmentService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/checklist-attachments")
public class ChecklistAttachmentController {

    private final ChecklistAttachmentService attachmentService;

    public ChecklistAttachmentController(ChecklistAttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    // 1️⃣ Upload attachment for a checklist response
    @PreAuthorize("hasAnyRole('ADMIN','SURVEYOR')")
    @PostMapping("/upload")
    public ChecklistAttachment uploadAttachment(
            @RequestParam Long responseId,
            @RequestParam MultipartFile file) {

        return attachmentService.uploadAttachment(responseId, file);
    }

    // 2️⃣ Get attachments by response
    @GetMapping("/response/{responseId}")
    public List<ChecklistAttachment> getAttachments(
            @PathVariable Long responseId) {

        return attachmentService.getAttachmentsByResponse(responseId);
    }
}
