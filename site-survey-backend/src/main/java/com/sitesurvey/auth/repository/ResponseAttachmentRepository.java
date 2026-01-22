package com.sitesurvey.auth.repository;

import com.sitesurvey.auth.entity.ResponseAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResponseAttachmentRepository
        extends JpaRepository<ResponseAttachment, Long> {

    List<ResponseAttachment> findByResponseId(Long responseId);
}
