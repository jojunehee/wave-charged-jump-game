package com.jojunehee.wcjg.score;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/scores")
@CrossOrigin(origins = {
  "http://localhost:8080","http://127.0.0.1:8080",
  "http://localhost:8081","http://127.0.0.1:8081",
  "https://jojunehee.github.io"
})
public class ScoreController {
  private final ScoreService svc;
  public ScoreController(ScoreService s){ this.svc=s; }

  @PostMapping
  public ResponseEntity<Map<String,Object>> create(@RequestBody Map<String,Object> body){
    Object n = body.get("name");
    Object sc = body.get("score");
    if (sc==null) return ResponseEntity.badRequest().build();
    int score;
    try { score = (sc instanceof Number) ? ((Number)sc).intValue() : Integer.parseInt(String.valueOf(sc)); }
    catch (Exception e){ return ResponseEntity.badRequest().build(); }
    Score saved = svc.create(n==null? null : String.valueOf(n), score);
    Map<String,Object> out = new LinkedHashMap<>();
    out.put("id", saved.getId());
    out.put("name", saved.getName());
    out.put("score", saved.getScore());
    out.put("createdAt", saved.getCreatedAt().toString());
    return ResponseEntity.status(HttpStatus.CREATED).body(out);
  }

  @GetMapping("/top")
  public Map<String,Object> top(@RequestParam(defaultValue="20") int limit){
    List<Score> list = svc.topList(limit);
    List<Map<String,Object>> items = new ArrayList<>();
    int rank = 1;
    for (Score s : list){
      Map<String,Object> m = new LinkedHashMap<>();
      m.put("rank", rank++);
      m.put("id", s.getId());
      m.put("name", s.getName());
      m.put("score", s.getScore());
      m.put("createdAt", s.getCreatedAt().toString());
      items.add(m);
    }
    return Map.of("items", items);
  }

  @GetMapping
  public List<Map<String,Object>> legacy(@RequestParam(defaultValue="20") int limit){
    List<Score> list = svc.topList(limit);
    List<Map<String,Object>> out = new ArrayList<>();
    for (Score s : list){
      Map<String,Object> m = new LinkedHashMap<>();
      m.put("id", s.getId());
      m.put("name", s.getName());
      m.put("score", s.getScore());
      m.put("createdAt", s.getCreatedAt().toString());
      out.add(m);
    }
    return out;
  }
}
