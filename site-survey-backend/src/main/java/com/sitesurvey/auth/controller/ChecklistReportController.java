package com.sitesurvey.auth.controller;

import com.sitesurvey.auth.service.ChecklistReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ChecklistReportController {

    private final ChecklistReportService reportService;

    public ChecklistReportController(ChecklistReportService reportService) {
        this.reportService = reportService;
    }

    // ✅ EXISTING – PDF DOWNLOAD (KEEP)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/checklist/{checklistId}")
    public ResponseEntity<byte[]> downloadChecklistReport(
            @PathVariable Long checklistId) {

        byte[] pdf = reportService.generateChecklistPdf(checklistId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=checklist-report-" + checklistId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    // ✅ NEW – DASHBOARD SUMMARY (Step 4.15)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardSummary() {
        return reportService.getDashboardSummary();
    }
}
