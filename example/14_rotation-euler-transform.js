// Rotation-Euler Transform — 오브젝트를 오일러 회전으로 회전시키는 예제

// 회전(Rotation)**을 Euler 각도를 사용해 설정하는 예제야.
// Euler는 세 축(X, Y, Z)을 기준으로 순차적으로 회전하는 방식이고, 여기서는 Y축으로 90도 회전한 상자를 보여줘.

import * as THREE from 'three'; // Three.js 라이브러리 import

// 🟩 1. 씬, 카메라, 렌더러 생성 및 설정
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 🟦 2. 박스 오브젝트 생성
const boxGeometry = new THREE.BoxGeometry(2, 1, 0.5); // 가로 2, 세로 1, 깊이 0.5
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // 조명 반응하는 초록색 재질
const box = new THREE.Mesh(boxGeometry, boxMaterial);

// ✅ 3. Euler 회전 적용 (Y축으로 90도 회전)
const eulerRotation = new THREE.Euler(0, Math.PI / 2, 0); // (x, y, z) 순서 회전
box.rotation.setFromVector3(eulerRotation); // Vector3로부터 회전 적용

scene.add(box); // 씬에 박스 추가

console.log("MyBox", box.rotation, box.quaternion); 
// rotation은 Euler, quaternion은 내부 회전 표현으로 자동 계산됨

// 🧭 4. 헬퍼 요소들 추가 (축 & 그리드)
const axesHelper = new THREE.AxesHelper(5); // XYZ 축 표시
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10); // 바닥 격자
scene.add(gridHelper);

// 💡 5. 조명 설정
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 전체 조명
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5); // 점광원
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// 🟥 6. 카메라 위치 및 시점
camera.position.set(2, 2, 2); // 카메라 위치 설정
camera.lookAt(0, 0, 0);       // 카메라가 원점(박스)을 바라보도록 설정

// 🔁 7. 애니메이션 루프
function animate() {
    requestAnimationFrame(animate); // 프레임마다 반복 호출
    renderer.render(scene, camera); // 장면을 카메라 시점으로 렌더링
}
animate(); // 애니메이션 시작
