// Translation — 오브젝트의 위치를 이동(translate)시키는 예제
// box.position.set(2, 0, 0)를 통해 상자를 원점(0, 0, 0)에서 X축 방향으로 2만큼 이동시키는 것

import * as THREE from 'three'; // Three.js 라이브러리 import

// 🟩 1. 씬, 카메라, 렌더러 설정
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,                                // 시야각
    window.innerWidth / window.innerHeight, // 화면 비율
    0.1,                               // near 클리핑 거리
    1000                               // far 클리핑 거리
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // 캔버스 크기 설정
document.body.appendChild(renderer.domElement); // HTML 문서에 추가

// 🟦 2. 박스 오브젝트 생성
const boxGeometry = new THREE.BoxGeometry(2, 1, 0.5); // 크기: 가로 2, 세로 1, 깊이 0.5
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // 조명 반응하는 초록색 재질
const box = new THREE.Mesh(boxGeometry, boxMaterial);

// ✅ 3. 박스 위치 설정 (translation)
// 원래는 (0, 0, 0)에 위치하지만, X축 방향으로 2만큼 이동
box.position.set(2, 0, 0);

scene.add(box); // 씬에 박스 추가

console.log("MyBox", box); // 콘솔에서 위치/속성 확인 가능

// 🧭 4. 보조 시각 도구
const axesHelper = new THREE.AxesHelper(5); // XYZ 축 표시 (길이 5)
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10); // 바닥 격자 (10x10)
scene.add(gridHelper);

// 💡 5. 조명 설정
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 전체 장면을 은은하게 밝히는 빛
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5); // 점광원
pointLight.position.set(10, 10, 10); // 광원 위치
scene.add(pointLight);

// 🟥 6. 카메라 위치 및 시점 설정
camera.position.set(2, 2, 2); // 카메라 위치
camera.lookAt(0, 0, 0);       // 원점(0,0,0)을 바라보도록 설정

// 🔁 7. 애니메이션 루프
function animate() {
    requestAnimationFrame(animate); // 프레임 요청
    renderer.render(scene, camera); // 장면을 카메라 시점으로 렌더링
}
animate(); // 렌더링 시작
