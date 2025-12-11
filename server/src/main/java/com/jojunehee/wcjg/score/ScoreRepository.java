package com.jojunehee.wcjg.score;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import java.time.Instant;

public interface ScoreRepository extends JpaRepository<Score, Long> {
  Optional<Score> findByName(String name);
  
  List<Score> findByCreatedAtBetween(Instant from, Instant to, Pageable pageable);
  List<Score> findByCreatedAtAfter(Instant from, Pageable pageable);
  List<Score> findByCreatedAtBefore(Instant to, Pageable pageable);
}