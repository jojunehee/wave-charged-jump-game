package com.jojunehee.wcjg.score;
import org.springframework.beans.factory.annotation.Value; 
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; 
import java.util.List;

@Service
public class ScoreService {
  private final ScoreRepository repo; 
  public ScoreService(ScoreRepository r){ this.repo=r; }

  @Value("${app.leaderboard.max:50}") 
  private int max;

  @Transactional
  public Score create(String rawName, int score){
    String name = rawName==null? "" : rawName.trim();
    if (name.isEmpty()) name = "Anonymous";
    if (name.length()>24) name = name.substring(0,24);
    if (score<0) score=0; 
    if (score>100000) score=100000;
    return repo.save(new Score(name, score));
  }

  @Transactional(readOnly = true)
  public List<Score> top(int limit){
    int n = (limit<=0 || limit>max) ? max : limit;
    return repo.findAll().stream()
      .sorted((a,b)-> b.getScore()!=a.getScore()? (b.getScore()-a.getScore())
              : b.getCreatedAt().compareTo(a.getCreatedAt()))
      .limit(n).toList();
  }
}
