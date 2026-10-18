package com.luudev.taskflow;
import jakarta.persistence.*;
@Entity @Table(name="tasks")
public class Task {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=120) private String title;
 @Column(nullable=false,length=1000) private String description="";
 @Column(nullable=false) private boolean completed;
 protected Task() {}
 public Task(String title,String description,boolean completed) { update(title,description,completed); }
 public void update(String title,String description,boolean completed) { this.title=title.trim(); this.description=description; this.completed=completed; }
 public Long getId(){return id;} public String getTitle(){return title;} public String getDescription(){return description;} public boolean isCompleted(){return completed;}
}
