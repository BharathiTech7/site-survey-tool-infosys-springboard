package com.sitesurvey.auth.repository;

import com.sitesurvey.auth.entity.ChecklistResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChecklistResponseRepository
        extends JpaRepository<ChecklistResponse, Long> {

    // Get all responses for a checklist
    List<ChecklistResponse> findByChecklistId(Long checklistTemplateId);

    // Get response for specific question
    Optional<ChecklistResponse> findByChecklistIdAndQuestionId(
            Long checklistId,
            Long questionId
    );

    // 🔹 STEP 4.11 – REPORTING (ADD THESE)
    long countByChecklistId(Long checklistId);

    long countByChecklistIdAndStatus(
            Long checklistId,
            String status
    );
    long countByStatus(String status);

}
