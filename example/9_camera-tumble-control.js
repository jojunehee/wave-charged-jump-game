// Camera control-tumble — 마우스로 카메라를 회전(tumble)시키는 예제
// 돌면서 촬영!
import * as THREE from 'three'; // Three.js 라이브러리 import

// 🟩 1. 씬, 카메라, 렌더러 초기 설정
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,                                // 시야각
    window.innerWidth / window.innerHeight, // 화면 비율
    0.1,                               // near 클리핑 거리
    1000                               // far 클리핑 거리
);

const renderer = new THREE.WebGLRenderer(); // 렌더러 생성
renderer.setSize(window.innerWidth, window.innerHeight); // 화면 크기 설정
document.body.appendChild(renderer.domElement); // 캔버스를 HTML 문서에 추가

// 🟦 2. 큐브 생성 및 씬에 추가
const geometry = new THREE.BoxGeometry(); // 정육면체 지오메트리
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 초록색 재질
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 🟥 3. 초기 카메라 위치
camera.position.z = 5;

// 🟨 4. 카메라 회전(Tumble)을 위한 제어 변수들
let isDragging = false; // 마우스 드래그 상태 여부
let previousMousePosition = { x: 0, y: 0 }; // 직전 마우스 위치 저장
let azimuth = 0;                 // 좌우 회전을 나타내는 각도 (라디안)
let elevation = Math.PI / 2;     // 위아래 각도 (PI/2 = 수평 방향)
let distance = 5;                // 카메라와 큐브 사이 거리

// 🖱️ 5. 마우스 드래그 이벤트 처리

// Alt + 왼쪽 클릭 시 드래그 시작
renderer.domElement.addEventListener('mousedown', function (e) {
    if (e.altKey && e.button === 0) {
        isDragging = true;
    }
});

// 드래그 중 마우스가 움직일 때 카메라 각도 조절
renderer.domElement.addEventListener('mousemove', function (e) {
    if (isDragging) {
        const deltaX = e.offsetX - previousMousePosition.x; // 좌우 이동량
        const deltaY = e.offsetY - previousMousePosition.y; // 상하 이동량

        azimuth -= deltaX * 0.005; // 좌우 회전 (반전 방향이 자연스러움)
        elevation = Math.max(0.1, Math.min(Math.PI, elevation - deltaY * 0.005)); // 상하 회전 제한 (0~180도)

        updateCamera(); // 카메라 위치 갱신
    }

    // 현재 마우스 위치 저장
    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };
});

// 마우스 버튼을 놓으면 드래그 종료
document.addEventListener('mouseup', function (e) {
    isDragging = false;
});

// 🧭 6. 카메라 위치 갱신 함수 (구면 좌표계 → 직교 좌표계 변환)
function updateCamera() {
    camera.position.x = distance * Math.sin(elevation) * Math.sin(azimuth); // x = r * sin(θ) * sin(φ)
    camera.position.y = distance * Math.cos(elevation);                     // y = r * cos(θ)
    camera.position.z = distance * Math.sin(elevation) * Math.cos(azimuth); // z = r * sin(θ) * cos(φ)
    camera.lookAt(cube.position); // 항상 큐브 중심을 바라보도록 설정
}

// 🔁 7. 애니메이션 루프
function animate() {
    requestAnimationFrame(animate); // 프레임 반복 요청
    renderer.render(scene, camera); // 현재 카메라 시점으로 장면 렌더링
}
animate(); // 렌더링 시작
