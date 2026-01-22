package com.sitesurvey.auth.service;

import com.sitesurvey.auth.dto.ChecklistSummaryDto;
import com.sitesurvey.auth.entity.ChecklistQuestion;
import com.sitesurvey.auth.entity.ChecklistResponse;
import com.sitesurvey.auth.entity.ChecklistTemplate;
import com.sitesurvey.auth.entity.User;
import com.sitesurvey.auth.repository.ChecklistQuestionRepository;
import com.sitesurvey.auth.repository.ChecklistResponseRepository;
import com.sitesurvey.auth.repository.ChecklistTemplateRepository;
import com.sitesurvey.auth.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChecklistResponseService {

    private final ChecklistResponseRepository responseRepository;
    private final ChecklistTemplateRepository checklistTemplateRepository;
    private final ChecklistQuestionRepository questionRepository;
    private final UserRepository userRepository;

    public ChecklistResponseService(
            ChecklistResponseRepository responseRepository,
            ChecklistTemplateRepository checklistTemplateRepository,
            ChecklistQuestionRepository questionRepository,
            UserRepository userRepository) {

        this.responseRepository = responseRepository;
        this.checklistTemplateRepository = checklistTemplateRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
    }

    // 1️⃣ Save / Autosave response (DRAFT)
    public ChecklistResponse saveDraftResponse(
            Long checklistTemplateId,
            Long questionId,
            String answer) {

        ChecklistTemplate checklistTemplate =
                checklistTemplateRepository.findById(checklistTemplateId)
                        .orElseThrow(() -> new RuntimeException("ChecklistTemplate not found"));

        ChecklistQuestion question =
                questionRepository.findById(questionId)
                        .orElseThrow(() -> new RuntimeException("ChecklistQuestion not found"));

        // 🔐 Get logged-in user
        Object principal =
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Get existing response if present
        ChecklistResponse response =
                responseRepository
                        .findByChecklistIdAndQuestionId(
                                checklistTemplateId, questionId)
                        .orElse(null);

        // 🔒 Block edit if already submitted
        if (response != null && "SUBMITTED".equals(response.getStatus())) {
            throw new RuntimeException(
                    "Response already submitted. Editing not allowed.");
        }

        // ✅ Create new response if not exists
        if (response == null) {
            response = new ChecklistResponse();
            response.setChecklist(checklistTemplate);
            response.setQuestion(question);
            response.setUser(user); // 🔥 LINK USER
        }

        // ✅ Update answer
        response.setAnswer(answer);
        response.setStatus("DRAFT");

        return responseRepository.save(response);
    }

    // 2️⃣ Submit final response
    public ChecklistResponse submitResponse(Long responseId) {

        ChecklistResponse response =
                responseRepository.findById(responseId)
                        .orElseThrow(() -> new RuntimeException("Response not found"));

        response.setStatus("SUBMITTED");
        return responseRepository.save(response);
    }

    // 3️⃣ Get responses by checklist
    public List<ChecklistResponse> getResponsesByChecklist(Long checklistTemplateId) {
        return responseRepository.findByChecklistId(checklistTemplateId);
    }

    // 4️⃣ Checklist summary (for reports & dashboard)
    public ChecklistSummaryDto getChecklistSummary(Long checklistId) {

        long total = responseRepository.countByChecklistId(checklistId);
        long submitted =
                responseRepository.countByChecklistIdAndStatus(
                        checklistId, "SUBMITTED");
        long draft =
                responseRepository.countByChecklistIdAndStatus(
                        checklistId, "DRAFT");

        return new ChecklistSummaryDto(
                checklistId,
                total,
                submitted,
                draft
        );
    }
}
