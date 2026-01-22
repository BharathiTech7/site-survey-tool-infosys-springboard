package com.sitesurvey.auth.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "response_attachments")
public class ResponseAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which response this file belongs to
    @ManyToOne
    @JoinColumn(name = "response_id", nullable = false)
    private ChecklistResponse response;

    // File path (local storage)
    private String filePath;

    // ---- getters & setters ----

    public Long getId() {
        return id;
    }

    public ChecklistResponse getResponse() {
        return response;
    }

    public void setResponse(ChecklistResponse response) {
        this.response = response;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
}
