// Example code - Animation — 지점 배열을 따라 움직이며 방향을 바꾸는 큐브 애니메이션

import * as THREE from 'three'; // Three.js 라이브러리 import

// 🟩 1. 씬, 카메라, 렌더러 초기화
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,                                 // 시야각
    window.innerWidth / window.innerHeight, // 화면 비율
    0.1,                                // 가까운 클리핑 거리
    1000                                // 먼 클리핑 거리
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // 크기 설정
document.body.appendChild(renderer.domElement); // 캔버스를 HTML에 추가

// 🟥 2. 카메라 위치 설정 (멀리서 보기 위해 z값 증가)
camera.position.z = 20;

// 🟦 3. 큐브 생성
const geometry = new THREE.BoxGeometry(); // 기본 정육면체
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 초록색 기본 재질
const cube = new THREE.Mesh(geometry, material);
scene.add(cube); // 큐브를 씬에 추가

// 🧭 4. 이동 경로 지점 정의
const points = [
    new THREE.Vector3(-10, 0, 0),  // 왼쪽
    new THREE.Vector3(0, 10, 0),   // 위쪽
    new THREE.Vector3(10, 0, 0)    // 오른쪽
];

let currentSegment = 0;     // 현재 목표 지점 인덱스
const speed = 0.25;         // 큐브 이동 속도

// 🎯 5. 큐브 이동 애니메이션 함수
function cube_animation() {
    // 현재 목표 지점에 충분히 가까워졌다면 다음 지점으로 전환
    if (cube.position.distanceTo(points[currentSegment]) < 0.25) {
        currentSegment = (currentSegment + 1) % points.length; // 다음 지점 순환
    }

    // 목표 지점
    const targetPosition = points[currentSegment];

    // 목표 방향 계산: 목표 지점 - 현재 위치 → 방향 벡터
    const direction = new THREE.Vector3()
        .subVectors(targetPosition, cube.position)
        .normalize();

    // 방향 벡터 * 속도를 더하여 이동
    cube.position.addScaledVector(direction, speed);

    // 큐브가 진행 방향을 향하도록 회전
    cube.lookAt(targetPosition);
}

// 🔁 6. 애니메이션 루프
function animate() {
    requestAnimationFrame(animate); // 매 프레임마다 애니메이션 호출
    cube_animation();               // 큐브 이동 및 회전 처리
    renderer.render(scene, camera); // 장면 렌더링
}

// ▶️ 7. 애니메이션 시작
animate();
