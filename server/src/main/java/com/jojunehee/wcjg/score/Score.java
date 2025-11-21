package com.jojunehee.wcjg.score;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name="scores", indexes = @Index(name="idx_score_created", columnList="score, createdAt"))
public class Score {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable=false, length=24) private String name;
  @Column(nullable=false) private int score;
  @Column(nullable=false) private Instant createdAt = Instant.now();

  public Score() {}
  public Score(String name, int score){ this.name=name; this.score=score; }

  public Long getId(){ return id; }
  public String getName(){ return name; }
  public int getScore(){ return score; }
  public Instant getCreatedAt(){ return createdAt; }

  public void setName(String n){ this.name=n; }
  public void setScore(int s){ this.score=s; }
  public void setCreatedAt(Instant t){ this.createdAt=t; }
}