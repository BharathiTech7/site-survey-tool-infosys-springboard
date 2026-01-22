package com.sitesurvey.auth.controller;

import com.sitesurvey.auth.entity.ChecklistQuestion;
import com.sitesurvey.auth.entity.ChecklistTemplate;
import com.sitesurvey.auth.service.ChecklistService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/checklists")
public class ChecklistController {

    private final ChecklistService checklistService;

    public ChecklistController(ChecklistService checklistService) {
        this.checklistService = checklistService;
    }

    // ✅ Create checklist for a space
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/space/{spaceId}")
    public ChecklistTemplate createChecklist(
            @PathVariable Long spaceId,
            @RequestBody ChecklistTemplate checklistTemplate) {

        return checklistService.createChecklist(spaceId, checklistTemplate);
    }

    // ✅ Add question to checklist
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{checklistId}/question")
    public ChecklistQuestion addQuestion(
            @PathVariable Long checklistId,
            @RequestBody ChecklistQuestion question) {

        return checklistService.addQuestion(checklistId, question);
    }

    // ✅ Get all checklists for a space
    @GetMapping("/space/{spaceId}")
    public List<ChecklistTemplate> getChecklists(@PathVariable Long spaceId) {
        return checklistService.getChecklistsBySpace(spaceId);
    }

    // ✅ Get questions of a checklist
    @GetMapping("/{checklistId}/questions")
    public List<ChecklistQuestion> getQuestions(@PathVariable Long checklistId) {
        return checklistService.getQuestionsByChecklist(checklistId);
    }
}
