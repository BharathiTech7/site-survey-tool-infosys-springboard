package com.sitesurvey.auth.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "checklist_questions")
public class ChecklistQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String questionText;

    // TEXT, NUMBER, YES_NO
    private String questionType;

    // Each question belongs to ONE checklist
    @ManyToOne
    @JoinColumn(name = "checklist_template_id", nullable = false)
    @JsonIgnore
    private ChecklistTemplate checklistTemplate;

    // getters & setters
    public Long getId() {
        return id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public ChecklistTemplate getChecklistTemplate() {
        return checklistTemplate;
    }

    public void setChecklistTemplate(ChecklistTemplate checklistTemplate) {
        this.checklistTemplate = checklistTemplate;
    }
}
