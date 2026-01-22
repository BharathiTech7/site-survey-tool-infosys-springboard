package com.sitesurvey.auth.repository;

import com.sitesurvey.auth.entity.ChecklistQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChecklistQuestionRepository
        extends JpaRepository<ChecklistQuestion, Long> {

    // Get all questions for a checklist
    List<ChecklistQuestion> findByChecklistTemplateId(Long checklistTemplateId);
}
