// Keyboard handling in WebGL(1) — 키보드 입력으로 큐브 색상 변경하기

import * as THREE from 'three'; // Three.js 라이브러리 import

// 🟩 1. 씬, 카메라, 렌더러 초기 설정
const scene = new THREE.Scene(); // 3D 객체들이 들어갈 장면 생성

const camera = new THREE.PerspectiveCamera(
    75,                                // fov: 시야각
    window.innerWidth / window.innerHeight, // 종횡비
    0.1,                               // near: 가까운 렌더링 범위
    1000                               // far: 먼 렌더링 범위
);

const renderer = new THREE.WebGLRenderer(); // WebGL 기반 렌더러 생성
renderer.setSize(window.innerWidth, window.innerHeight); // 렌더링 화면 크기 설정
document.body.appendChild(renderer.domElement); // 렌더링 결과를 HTML 문서에 삽입

// 🟨 2. 큐브 생성: 기본 Geometry + Material 조합
const geometry = new THREE.BoxGeometry(); // 정육면체 지오메트리 생성
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 기본 초록색 재질 (조명 영향 없음)
const cube = new THREE.Mesh(geometry, material); // 지오메트리 + 재질로 메쉬 생성
scene.add(cube); // 씬에 큐브 추가

// 카메라를 뒤쪽으로 이동시켜 큐브가 보이도록 설정
camera.position.z = 5;

// 🟧 3. 색상 변경 함수
function changeColor(colorHex) {
    cube.material.color.set(colorHex); // 큐브의 색상을 주어진 색상(hex)으로 변경
}

// 🟥 4. 키보드 이벤트 처리
// 키를 누르면 'keydown' 이벤트 발생 → 이벤트 객체(event) 안에 누른 키 정보 있음
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case '1':
            changeColor(0xff0000); // 1번 키: 빨강
            break;
        case '2':
            changeColor(0x00ff00); // 2번 키: 초록
            break;
        case '3':
            changeColor(0x0000ff); // 3번 키: 파랑
            break;
        case '4':
            changeColor(0xffff00); // 4번 키: 노랑
            break;
        case '5':
            changeColor(0xff00ff); // 5번 키: 자홍
            break;
        default:
            break; // 다른 키는 무시
    }
});

// 🔁 5. 렌더링 루프
function animate() {
    requestAnimationFrame(animate); // 다음 프레임을 요청하여 루프 유지
    renderer.render(scene, camera); // 장면을 카메라 시점으로 렌더링
}
animate(); // 렌더링 시작
