// Scaling — 3D 오브젝트의 크기(스케일)를 조절하는 예제

import * as THREE from 'three'; // Three.js 라이브러리 불러오기

// 🟩 1. 씬, 카메라, 렌더러 초기 설정
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,                                // 시야각
    window.innerWidth / window.innerHeight, // 화면 비율
    0.1,                               // 가까운 클리핑 거리
    1000                               // 먼 클리핑 거리
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // 캔버스 크기 설정
document.body.appendChild(renderer.domElement); // 캔버스를 HTML에 추가

// 🟦 2. 박스(상자) 객체 생성
const boxGeometry = new THREE.BoxGeometry(2, 1, 0.5); // 너비 2, 높이 1, 깊이 0.5
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // 조명 반응하는 초록색 재질
const box = new THREE.Mesh(boxGeometry, boxMaterial);

// ✅ 3. 스케일 조절: Y축 방향으로 2배 확장
box.scale.set(1, 2, 1); // (x, y, z) 방향 스케일 설정 → 높이만 2배

scene.add(box); // 박스를 씬에 추가

console.log("MyBox", box); // 콘솔로 박스 객체 확인 (디버깅용)

// 🧭 4. 보조 시각 요소 추가
const axesHelper = new THREE.AxesHelper(5); // XYZ 축을 표시하는 헬퍼 (길이 5)
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10); // 바닥 그리드 (10x10)
scene.add(gridHelper);

// 💡 5. 조명 추가
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 은은한 전체 조명
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5); // 점광원
pointLight.position.set(10, 10, 10); // 광원 위치 설정
scene.add(pointLight);

// 🟥 6. 카메라 위치 및 시점 설정
camera.position.set(2, 2, 2); // 카메라 위치 설정
camera.lookAt(0, 0, 0);       // 카메라가 씬의 중심(0, 0, 0)을 바라보도록 설정

// 🔁 7. 애니메이션 루프
function animate() {
    requestAnimationFrame(animate); // 프레임 반복 요청
    renderer.render(scene, camera); // 장면을 카메라 시점으로 렌더링
}
animate(); // 렌더링 시작
