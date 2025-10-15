// simple translation in WebGL — WASD로 큐브 이동시키기

import * as THREE from 'three'; // Three.js 라이브러리 import

// 🟩 1. 씬, 카메라, 렌더러 설정
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,                                // 시야각
    window.innerWidth / window.innerHeight, // 화면 비율
    0.1,                               // near 클리핑 거리
    1000                               // far 클리핑 거리
);

const renderer = new THREE.WebGLRenderer(); // 렌더러 생성
renderer.setSize(window.innerWidth, window.innerHeight); // 크기 설정
document.body.appendChild(renderer.domElement); // 렌더링된 canvas를 HTML 문서에 추가

// 🟦 2. 큐브 오브젝트 생성 및 씬에 추가
const geometry = new THREE.BoxGeometry(); // 정육면체 지오메트리
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 초록색 기본 재질
const cube = new THREE.Mesh(geometry, material); // 지오메트리 + 재질로 메쉬 생성
scene.add(cube); // 씬에 추가

// 🟥 3. 카메라 위치 설정 (z축 뒤로 이동해서 큐브를 볼 수 있게 함)
camera.position.z = 5;

// 🌀 4. 애니메이션 루프: 매 프레임마다 렌더링
function animate() {
    requestAnimationFrame(animate); // 다음 프레임 요청
    renderer.render(scene, camera); // 장면을 카메라 시점으로 렌더링
}
animate(); // 애니메이션 시작

// 🖱️ 5. 키보드 입력 처리: 큐브 위치 이동
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'w': // 위로 이동 (Y축 +)
            cube.position.y += 0.1;
            break;
        case 's': // 아래로 이동 (Y축 -)
            cube.position.y -= 0.1;
            break;
        case 'a': // 왼쪽으로 이동 (X축 -)
            cube.position.x -= 0.1;
            break;
        case 'd': // 오른쪽으로 이동 (X축 +)
            cube.position.x += 0.1;
            break;
    }
});
