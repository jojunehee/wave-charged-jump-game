package com.jojunehee.wcjg.score;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ScoreRepository extends JpaRepository<Score, Long> {
  Optional<Score> findByName(String name);
}