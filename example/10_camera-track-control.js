// Camera control-track — Alt + 휠 드래그로 카메라를 수평/수직 이동시키는 예제

import * as THREE from 'three'; // Three.js 라이브러리 import

// 🟩 1. 씬, 카메라, 렌더러 설정
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,                                 // 시야각
    window.innerWidth / window.innerHeight, // 화면 비율
    0.1,                                // near 클리핑 거리
    1000                                // far 클리핑 거리
);

const renderer = new THREE.WebGLRenderer(); // 렌더러 생성
renderer.setSize(window.innerWidth, window.innerHeight); // 전체 크기로 설정
document.body.appendChild(renderer.domElement); // 캔버스를 HTML에 추가

// 🟦 2. 큐브 오브젝트 생성 및 씬에 추가
const geometry = new THREE.BoxGeometry(); // 기본 정육면체
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 초록색 재질
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 🟥 3. 초기 카메라 위치 설정
camera.position.z = 5; // z축 뒤에서 바라보도록 배치

// 🟨 4. 카메라 트래킹 제어 변수
let isTracking = false; // 트래킹 상태 플래그
let lastMouseX = 0;      // 직전 마우스 X 위치
let lastMouseY = 0;      // 직전 마우스 Y 위치

// 🖱️ 5. Alt + 가운데 마우스 버튼 누르면 트래킹 시작
renderer.domElement.addEventListener('mousedown', function (event) {
    if (event.altKey && event.button === 1) { // 가운데 버튼 (button === 1)
        isTracking = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
});

// 마우스 버튼 놓으면 트래킹 종료
document.addEventListener('mouseup', function (event) {
    isTracking = false;
});

// 마우스 이동 시 카메라 위치 변경
renderer.domElement.addEventListener('mousemove', function (event) {
    if (isTracking) {
        const deltaX = event.clientX - lastMouseX; // 마우스 X 변화량
        const deltaY = event.clientY - lastMouseY; // 마우스 Y 변화량

        updateCamera(deltaX, deltaY); // 카메라 위치 조정

        // 현재 마우스 위치 저장
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
});

// 🧭 6. 카메라 위치 업데이트 함수
function updateCamera(deltaX, deltaY) {
    // 카메라를 X/Y 축으로 평행 이동
    camera.position.x -= deltaX * 0.01; // 좌우로 이동
    camera.position.y += deltaY * 0.01; // 위아래로 이동 (마우스 Y는 화면상 아래로 가면 값이 커지므로 +)

    // 변경된 위치로 렌더링 적용
    camera.updateProjectionMatrix(); // ※ 사실 이 코드는 시야각 변경 시에만 필요하지만 넣어도 문제 없음
}

// 🔁 7. 애니메이션 루프
function animate() {
    requestAnimationFrame(animate); // 프레임 반복
    renderer.render(scene, camera); // 장면을 카메라 시점으로 렌더링
}
animate(); // 시작
