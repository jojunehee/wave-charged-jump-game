package com.jojunehee.wcjg.cheatlog;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "cheat_logs")
public class CheatLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 24)
    private String playerName;

    @Column(length = 512)
    private String deviceInfo;

    // 치트 감지 데이터
    @Column(nullable = false)
    private double maxReachedHeight;

    @Column(nullable = false)
    private double totalPositiveJumps;

    @Column(nullable = false)
    private double possibleMaxHeight;

    // 게임 결과
    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private int playTimeSeconds;

    @Column(length = 16)
    private String gameMode;

    // 점프 로그 (JSON 문자열로 저장)
    @Column(columnDefinition = "TEXT")
    private String jumpLogs;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public CheatLog() {}

    // Getters
    public Long getId() { return id; }
    public String getPlayerName() { return playerName; }
    public String getDeviceInfo() { return deviceInfo; }
    public double getMaxReachedHeight() { return maxReachedHeight; }
    public double getTotalPositiveJumps() { return totalPositiveJumps; }
    public double getPossibleMaxHeight() { return possibleMaxHeight; }
    public int getScore() { return score; }
    public int getPlayTimeSeconds() { return playTimeSeconds; }
    public String getGameMode() { return gameMode; }
    public String getJumpLogs() { return jumpLogs; }
    public Instant getCreatedAt() { return createdAt; }

    // Setters
    public void setPlayerName(String playerName) { this.playerName = playerName; }
    public void setDeviceInfo(String deviceInfo) { this.deviceInfo = deviceInfo; }
    public void setMaxReachedHeight(double maxReachedHeight) { this.maxReachedHeight = maxReachedHeight; }
    public void setTotalPositiveJumps(double totalPositiveJumps) { this.totalPositiveJumps = totalPositiveJumps; }
    public void setPossibleMaxHeight(double possibleMaxHeight) { this.possibleMaxHeight = possibleMaxHeight; }
    public void setScore(int score) { this.score = score; }
    public void setPlayTimeSeconds(int playTimeSeconds) { this.playTimeSeconds = playTimeSeconds; }
    public void setGameMode(String gameMode) { this.gameMode = gameMode; }
    public void setJumpLogs(String jumpLogs) { this.jumpLogs = jumpLogs; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
