package com.sitesurvey.auth.controller;

import com.sitesurvey.auth.entity.ChecklistResponse;
import com.sitesurvey.auth.service.ChecklistResponseService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.sitesurvey.auth.dto.ChecklistSummaryDto;

@RestController
@RequestMapping("/api/checklist-responses")
public class ChecklistResponseController {

    private final ChecklistResponseService responseService;

    public ChecklistResponseController(ChecklistResponseService responseService) {
        this.responseService = responseService;
    }

    // 1️⃣ Save / Autosave response (DRAFT)
    // Used by web & mobile while filling survey
    @PreAuthorize("hasAnyRole('ADMIN','SURVEYOR')")
    @PostMapping("/draft")
    public ChecklistResponse saveDraftResponse(
            @RequestParam Long checklistTemplateId,
            @RequestParam Long questionId,
            @RequestParam String answer) {

        return responseService.saveDraftResponse(
                checklistTemplateId,
                questionId,
                answer
        );
    }

    // 2️⃣ Submit final response (lock answer)
    @PreAuthorize("hasAnyRole('ADMIN','SURVEYOR')")
    @PostMapping("/submit/{responseId}")
    public ChecklistResponse submitResponse(
            @PathVariable Long responseId) {

        return responseService.submitResponse(responseId);
    }

    // 3️⃣ Get all responses for a checklist template
    @GetMapping("/checklist/{checklistTemplateId}")
    public List<ChecklistResponse> getResponsesByChecklist(
            @PathVariable Long checklistTemplateId) {

        return responseService.getResponsesByChecklist(checklistTemplateId);
    }
    
    @GetMapping("/summary/{checklistId}")
    public ChecklistSummaryDto getChecklistSummary(
            @PathVariable Long checklistId) {

        return responseService.getChecklistSummary(checklistId);
    }

}
