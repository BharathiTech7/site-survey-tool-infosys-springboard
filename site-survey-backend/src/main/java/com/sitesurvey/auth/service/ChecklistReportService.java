package com.sitesurvey.auth.service;

import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.sitesurvey.auth.entity.ChecklistResponse;
import com.sitesurvey.auth.entity.ChecklistTemplate;
import com.sitesurvey.auth.repository.ChecklistResponseRepository;
import com.sitesurvey.auth.repository.ChecklistTemplateRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChecklistReportService {

    private final ChecklistTemplateRepository checklistTemplateRepository;
    private final ChecklistResponseRepository responseRepository;

    public ChecklistReportService(
            ChecklistTemplateRepository checklistTemplateRepository,
            ChecklistResponseRepository responseRepository) {
        this.checklistTemplateRepository = checklistTemplateRepository;
        this.responseRepository = responseRepository;
    }

    // ✅ PDF GENERATION (UNCHANGED)
    public byte[] generateChecklistPdf(Long checklistId) {

        ChecklistTemplate checklist =
                checklistTemplateRepository.findById(checklistId)
                        .orElseThrow(() -> new RuntimeException("Checklist not found"));

        List<ChecklistResponse> responses =
                responseRepository.findByChecklistId(checklistId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("Checklist Report")
                .setBold()
                .setFontSize(18));

        document.add(new Paragraph("Checklist: " + checklist.getName()));
        document.add(new Paragraph("Description: " + checklist.getDescription()));
        document.add(new Paragraph(" "));

        for (ChecklistResponse r : responses) {
            document.add(new Paragraph("Question: " + r.getQuestion().getQuestionText()).setBold());
            document.add(new Paragraph("Answer: " + r.getAnswer()));
            document.add(new Paragraph("Status: " + r.getStatus()));
            document.add(new Paragraph("Filled By: " +
                    (r.getUser() != null ? r.getUser().getUsername() : "N/A")));
            document.add(new Paragraph("------------------------------"));
        }

        document.close();
        return baos.toByteArray();
    }

    // ✅ DASHBOARD SUMMARY (FIXED)
    public Map<String, Object> getDashboardSummary() {

        long total = responseRepository.count();
        long submitted = responseRepository.countByStatus("SUBMITTED");
        long draft = responseRepository.countByStatus("DRAFT");

        double completion =
                total == 0 ? 0 : (submitted * 100.0) / total;

        Map<String, Object> map = new HashMap<>();
        map.put("totalResponses", total);
        map.put("submitted", submitted);
        map.put("draft", draft);
        map.put("completionPercent", completion);

        return map;
    }
}
