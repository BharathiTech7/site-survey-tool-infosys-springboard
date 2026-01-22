package com.sitesurvey.auth.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "checklist_templates")
public class ChecklistTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    // Each checklist belongs to ONE space
    @ManyToOne
    @JoinColumn(name = "space_id", nullable = false)
    private Space space;

    // One checklist has MANY questions
    @OneToMany(mappedBy = "checklistTemplate", cascade = CascadeType.ALL)
    private List<ChecklistQuestion> questions;

    // getters & setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Space getSpace() {
        return space;
    }

    public void setSpace(Space space) {
        this.space = space;
    }

    public List<ChecklistQuestion> getQuestions() {
        return questions;
    }

    public void setQuestions(List<ChecklistQuestion> questions) {
        this.questions = questions;
    }
}
