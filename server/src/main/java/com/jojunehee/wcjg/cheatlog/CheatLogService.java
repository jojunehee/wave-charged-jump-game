package com.jojunehee.wcjg.cheatlog;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class CheatLogService {
    private final CheatLogRepository repo;

    public CheatLogService(CheatLogRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public CheatLog create(
            String playerName,
            String deviceInfo,
            double maxReachedHeight,
            double totalPositiveJumps,
            double possibleMaxHeight,
            int score,
            int playTimeSeconds,
            String gameMode,
            String jumpLogs
    ) {
        CheatLog log = new CheatLog();

        // 이름 처리
        String name = (playerName == null) ? "" : playerName.trim();
        if (name.isEmpty()) name = "Anonymous";
        if (name.length() > 24) name = name.substring(0, 24);
        log.setPlayerName(name);

        // 디바이스 정보 (길이 제한)
        if (deviceInfo != null && deviceInfo.length() > 512) {
            deviceInfo = deviceInfo.substring(0, 512);
        }
        log.setDeviceInfo(deviceInfo);

        // 치트 감지 데이터
        log.setMaxReachedHeight(maxReachedHeight);
        log.setTotalPositiveJumps(totalPositiveJumps);
        log.setPossibleMaxHeight(possibleMaxHeight);

        // 게임 결과
        log.setScore(Math.max(0, Math.min(score, 100000)));
        log.setPlayTimeSeconds(Math.max(0, playTimeSeconds));

        // 게임 모드
        if (gameMode != null && gameMode.length() > 16) {
            gameMode = gameMode.substring(0, 16);
        }
        log.setGameMode(gameMode);

        // 점프 로그 (JSON)
        log.setJumpLogs(jumpLogs);

        return repo.save(log);
    }
    
    @Transactional(readOnly = true)
    public List<CheatLog> getAll(int limit) {
        int size = (limit <= 0) ? 50 : Math.min(limit, 200);
        Pageable p = PageRequest.of(0, size, Sort.by(Sort.Order.desc("createdAt")));
        return repo.findAll(p).getContent();
    }
}
