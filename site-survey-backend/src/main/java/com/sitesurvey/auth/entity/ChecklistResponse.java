package com.sitesurvey.auth.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sitesurvey.auth.entity.User;
import jakarta.persistence.*;



@Entity
@Table(name = "checklist_responses")
public class ChecklistResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which checklist this response belongs to
    @ManyToOne
    @JoinColumn(name = "checklist_id", nullable = false)
    @JsonIgnore
    private ChecklistTemplate checklist;


    // Which question is answered
    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private ChecklistQuestion question;

    // Actual answer (Yes / No / Text / Number)
    private String answer;

    // DRAFT or SUBMITTED
    private String status;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // ---- getters & setters ----
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


    public Long getId() {
        return id;
    }

    public ChecklistTemplate getChecklist() {
        return checklist;
    }

    public void setChecklist(ChecklistTemplate checklist) {
        this.checklist = checklist;
    }

    public ChecklistQuestion getQuestion() {
        return question;
    }

    public void setQuestion(ChecklistQuestion question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
