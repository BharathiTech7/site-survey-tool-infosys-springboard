package com.sitesurvey.auth.service;

import com.sitesurvey.auth.entity.ChecklistQuestion;
import com.sitesurvey.auth.entity.ChecklistTemplate;
import com.sitesurvey.auth.entity.Space;
import com.sitesurvey.auth.repository.ChecklistQuestionRepository;
import com.sitesurvey.auth.repository.ChecklistTemplateRepository;
import com.sitesurvey.auth.repository.SpaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChecklistService {

    private final ChecklistTemplateRepository checklistTemplateRepository;
    private final ChecklistQuestionRepository checklistQuestionRepository;
    private final SpaceRepository spaceRepository;
    private final AuditLogService auditLogService; // ✅ OK

    public ChecklistService(
            ChecklistTemplateRepository checklistTemplateRepository,
            ChecklistQuestionRepository checklistQuestionRepository,
            SpaceRepository spaceRepository,
            AuditLogService auditLogService) {

        this.checklistTemplateRepository = checklistTemplateRepository;
        this.checklistQuestionRepository = checklistQuestionRepository;
        this.spaceRepository = spaceRepository;
        this.auditLogService = auditLogService; // ✅ OK
    }

    // ✅ Create checklist template for a space
    public ChecklistTemplate createChecklist(Long spaceId, ChecklistTemplate checklistTemplate) {

        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() -> new RuntimeException("Space not found"));

        checklistTemplate.setSpace(space);

        // 🔥 STEP 1: SAVE FIRST
        ChecklistTemplate savedChecklist =
                checklistTemplateRepository.save(checklistTemplate);

        // 🔥 STEP 2: AUDIT LOG (PASTE HERE ONLY)
        auditLogService.log(
                "CREATE_CHECKLIST",
                "CHECKLIST",
                savedChecklist.getId()
        );

        // 🔥 STEP 3: RETURN
        return savedChecklist;
    }

    // ✅ Add question to checklist
    public ChecklistQuestion addQuestion(Long checklistId, ChecklistQuestion question) {

        ChecklistTemplate checklist =
                checklistTemplateRepository.findById(checklistId)
                        .orElseThrow(() -> new RuntimeException("Checklist not found"));

        question.setChecklistTemplate(checklist);

        // 🔥 STEP 1: SAVE FIRST
        ChecklistQuestion savedQuestion =
                checklistQuestionRepository.save(question);

        // 🔥 STEP 2: AUDIT LOG (PASTE HERE ONLY)
        auditLogService.log(
                "ADD_QUESTION",
                "CHECKLIST_QUESTION",
                savedQuestion.getId()
        );

        // 🔥 STEP 3: RETURN
        return savedQuestion;
    }

    // ✅ Get all checklists for a space
    public List<ChecklistTemplate> getChecklistsBySpace(Long spaceId) {
        return checklistTemplateRepository.findBySpaceId(spaceId);
    }

    // ✅ Get all questions for a checklist
    public List<ChecklistQuestion> getQuestionsByChecklist(Long checklistId) {
        return checklistQuestionRepository.findByChecklistTemplateId(checklistId);
    }
}
