package com.sitesurvey.auth.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "checklist_attachments")
public class ChecklistAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which response this attachment belongs to
    @ManyToOne
    @JoinColumn(name = "response_id", nullable = false)
    @JsonIgnore
    private ChecklistResponse checklistResponse;

    private String fileName;
    private String filePath;

    private LocalDateTime uploadedAt;

    // ---- getters & setters ----

    public Long getId() {
        return id;
    }

    public ChecklistResponse getChecklistResponse() {
        return checklistResponse;
    }

    public void setChecklistResponse(ChecklistResponse checklistResponse) {
        this.checklistResponse = checklistResponse;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
