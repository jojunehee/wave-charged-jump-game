package com.jojunehee.wcjg.score;
import org.springframework.http.*; 
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController 
@RequestMapping("/api/scores")
@CrossOrigin(origins = {
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "https://jojunehee.github.io"
})
public class ScoreController {
  private final ScoreService svc; 
  public ScoreController(ScoreService s){ this.svc=s; }

  @PostMapping
  public ResponseEntity<Map<String,Object>> create(@RequestBody Map<String,Object> body){
    Object n = body.get("name"); 
    Object s = body.get("score");
    if (s==null) return ResponseEntity.badRequest().build();
    int score;
    try {
      score = (s instanceof Number) ? ((Number)s).intValue() : Integer.parseInt(String.valueOf(s));
    } catch (Exception e) {
      return ResponseEntity.badRequest().build();
    }
    var saved = svc.create(n==null? null : String.valueOf(n), score);
    return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
  }

  @GetMapping
  public List<Map<String,Object>> top(@RequestParam(defaultValue="20") int limit){
    return svc.top(limit).stream().map(this::toDto).toList();
  }

  private Map<String,Object> toDto(Score e){
    return Map.of(
      "id", e.getId(),
      "name", e.getName(),
      "score", e.getScore(),
      "createdAt", e.getCreatedAt().toString()
    );
  }
}
