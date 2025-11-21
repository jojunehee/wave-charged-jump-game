package com.jojunehee.wcjg.score;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class ScoreService {
  private final ScoreRepository repo;
  public ScoreService(ScoreRepository r){ this.repo=r; }

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
  public List<Score> topList(int limit){
    int size = (limit<=0) ? 20 : Math.min(limit, 100);
    Pageable p = PageRequest.of(0, size, Sort.by(Sort.Order.desc("score"), Sort.Order.desc("createdAt")));
    return repo.findAll(p).getContent();
  }
}
