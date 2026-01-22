package com.sitesurvey.auth.dto;

public class ChecklistSummaryDto {

    private Long checklistId;
    private long totalResponses;
    private long submittedResponses;
    private long draftResponses;

    public ChecklistSummaryDto(
            Long checklistId,
            long totalResponses,
            long submittedResponses,
            long draftResponses) {

        this.checklistId = checklistId;
        this.totalResponses = totalResponses;
        this.submittedResponses = submittedResponses;
        this.draftResponses = draftResponses;
    }

    public Long getChecklistId() {
        return checklistId;
    }

    public long getTotalResponses() {
        return totalResponses;
    }

    public long getSubmittedResponses() {
        return submittedResponses;
    }

    public long getDraftResponses() {
        return draftResponses;
    }
}
