package com.sitesurvey.auth.repository;

import com.sitesurvey.auth.entity.ChecklistAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChecklistAttachmentRepository
        extends JpaRepository<ChecklistAttachment, Long> {

    // Get all attachments for a response
    List<ChecklistAttachment> findByChecklistResponseId(Long responseId);
}
