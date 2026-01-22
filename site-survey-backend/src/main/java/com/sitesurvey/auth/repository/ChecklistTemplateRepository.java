package com.sitesurvey.auth.repository;

import com.sitesurvey.auth.entity.ChecklistTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChecklistTemplateRepository
        extends JpaRepository<ChecklistTemplate, Long> {

    // Get all checklists for a space
    List<ChecklistTemplate> findBySpaceId(Long spaceId);
}
