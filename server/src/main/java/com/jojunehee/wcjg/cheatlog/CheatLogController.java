package com.jojunehee.wcjg.cheatlog;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/cheat-logs")
@CrossOrigin(origins = {
    "http://localhost:8080", "http://127.0.0.1:8080",
    "http://localhost:8081", "http://127.0.0.1:8081",
    "https://jojunehee.github.io"
})
public class CheatLogController {
    private final CheatLogService svc;
    
    // 관리자 비밀 키 (환경변수로 설정 가능)
    private static final String ADMIN_KEY = System.getenv("ADMIN_KEY") != null 
        ? System.getenv("ADMIN_KEY") 
        : "wcjg-admin-2025";

    public CheatLogController(CheatLogService svc) {
        this.svc = svc;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        try {
            // 필수 필드 추출
            String playerName = getStringOrNull(body.get("player_name"));
            String deviceInfo = getStringOrNull(body.get("device_info"));
            double maxReachedHeight = getDoubleOrZero(body.get("max_reached_height"));
            double totalPositiveJumps = getDoubleOrZero(body.get("total_positive_jumps"));
            double possibleMaxHeight = getDoubleOrZero(body.get("possible_max_height"));
            int score = getIntOrZero(body.get("score"));
            int playTimeSeconds = getIntOrZero(body.get("play_time_seconds"));
            String gameMode = getStringOrNull(body.get("game_mode"));
            
            // jump_logs는 JSON 배열을 문자열로 저장
            String jumpLogs = null;
            Object jumpLogsObj = body.get("jump_logs");
            if (jumpLogsObj != null) {
                if (jumpLogsObj instanceof String) {
                    jumpLogs = (String) jumpLogsObj;
                } else {
                    // List나 다른 객체면 JSON 문자열로 변환
                    jumpLogs = jumpLogsObj.toString();
                }
            }

            CheatLog saved = svc.create(
                playerName,
                deviceInfo,
                maxReachedHeight,
                totalPositiveJumps,
                possibleMaxHeight,
                score,
                playTimeSeconds,
                gameMode,
                jumpLogs
            );

            Map<String, Object> out = new LinkedHashMap<>();
            out.put("id", saved.getId());
            out.put("player_name", saved.getPlayerName());
            out.put("created_at", saved.getCreatedAt().toString());
            out.put("message", "Cheat log recorded successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(out);

        } catch (Exception e) {
            Map<String, Object> error = new LinkedHashMap<>();
            error.put("error", "Failed to save cheat log");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    @GetMapping("/admin")
    public ResponseEntity<?> getAll(
            @RequestParam String key,
            @RequestParam(defaultValue = "50") int limit
    ) {
        // 관리자 키 확인
        if (!ADMIN_KEY.equals(key)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid admin key"));
        }
        
        List<CheatLog> logs = svc.getAll(limit);
        List<Map<String, Object>> items = new ArrayList<>();
        
        for (CheatLog log : logs) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", log.getId());
            item.put("player_name", log.getPlayerName());
            item.put("device_info", log.getDeviceInfo());
            item.put("max_reached_height", log.getMaxReachedHeight());
            item.put("total_positive_jumps", log.getTotalPositiveJumps());
            item.put("possible_max_height", log.getPossibleMaxHeight());
            item.put("score", log.getScore());
            item.put("play_time_seconds", log.getPlayTimeSeconds());
            item.put("game_mode", log.getGameMode());
            item.put("jump_logs", log.getJumpLogs());
            item.put("created_at", log.getCreatedAt().toString());
            items.add(item);
        }
        
        return ResponseEntity.ok(Map.of(
            "count", items.size(),
            "items", items
        ));
    }

    private String getStringOrNull(Object obj) {
        return obj == null ? null : String.valueOf(obj);
    }

    private double getDoubleOrZero(Object obj) {
        if (obj == null) return 0.0;
        if (obj instanceof Number) return ((Number) obj).doubleValue();
        try {
            return Double.parseDouble(String.valueOf(obj));
        } catch (Exception e) {
            return 0.0;
        }
    }

    private int getIntOrZero(Object obj) {
        if (obj == null) return 0;
        if (obj instanceof Number) return ((Number) obj).intValue();
        try {
            return Integer.parseInt(String.valueOf(obj));
        } catch (Exception e) {
            return 0;
        }
    }
}
