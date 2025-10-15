// Camera control-dolly — 마우스 휠로 카메라 거리 조절(dolly in/out)
// 돌리는 거리만!
import * as THREE from 'three'; // Three.js 라이브러리 import

// 🟩 1. 씬, 카메라, 렌더러 초기 설정
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,                                // 시야각
    window.innerWidth / window.innerHeight, // 화면 비율
    0.1,                               // near 클리핑 거리
    1000                               // far 클리핑 거리
);

const renderer = new THREE.WebGLRenderer(); // WebGL 기반 렌더러 생성
renderer.setSize(window.innerWidth, window.innerHeight); // 캔버스 크기 설정
document.body.appendChild(renderer.domElement); // 캔버스를 HTML 문서에 추가

// 🟦 2. 큐브 오브젝트 생성
const geometry = new THREE.BoxGeometry(); // 정육면체 지오메트리
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 초록색 재질
const cube = new THREE.Mesh(geometry, material); // 메쉬 생성
scene.add(cube); // 씬에 큐브 추가

// 🟥 3. 초기 카메라 위치
camera.position.z = 5; // 카메라를 z축 뒤로 배치

// 🟨 4. Dolly 기능 구현을 위한 거리 변수
let distance = 5; // 카메라와 큐브 사이 초기 거리

// 🖱️ 5. 마우스 휠 이벤트로 dolly in/out 처리
renderer.domElement.addEventListener('wheel', function (event) {
    event.preventDefault(); // 기본 스크롤 기능 막기

    const delta = event.deltaY * -0.01; // 스크롤 양 정규화 (아래로 스크롤하면 앞으로 이동)

    distance += delta; // 거리 조절
    distance = Math.max(1, Math.min(100, distance)); // 최소 1, 최대 100으로 제한

    updateCamera(); // 카메라 위치 업데이트
});

// 🧭 6. 카메라 위치 갱신 함수
function updateCamera() {
    camera.position.z = distance; // z축 거리 변경
    camera.lookAt(cube.position); // 항상 큐브를 바라보게 설정
}

// 🔁 7. 애니메이션 루프
function animate() {
    requestAnimationFrame(animate); // 프레임 반복 요청
    renderer.render(scene, camera); // 장면을 카메라 시점으로 렌더링
}
animate(); // 애니메이션 시작
