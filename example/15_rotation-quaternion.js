// Rotation – Quaternion — 쿼터니언을 사용한 회전 예제
// applyQuaternion() 메서드를 통해 Y축 기준 90도(π/2 라디안) 회전을 적용했어.
import * as THREE from 'three'; // Three.js 라이브러리 import

// 🟩 1. 씬, 카메라, 렌더러 설정
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // 렌더링 크기 설정
document.body.appendChild(renderer.domElement); // 캔버스를 HTML에 추가

// 🟦 2. 박스 오브젝트 생성
const boxGeometry = new THREE.BoxGeometry(2, 1, 0.5); // 너비 2, 높이 1, 깊이 0.5
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // 초록색 조명 반응 재질
const box = new THREE.Mesh(boxGeometry, boxMaterial);

// ✅ 3. 쿼터니언 회전 생성 및 적용
// 축: (0, 1, 0) → Y축 기준
// 각도: Math.PI / 2 → 90도 회전
const quaternion = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0), // 회전 축
    Math.PI / 2                 // 회전 각도 (라디안 단위)
);
box.applyQuaternion(quaternion); // 회전 적용

scene.add(box); // 박스를 씬에 추가

// 회전 값 확인 (rotation: Euler 변환값, quaternion: 쿼터니언 자체)
console.log("MyBox", box.rotation, box.quaternion);

// 🧭 4. 시각적 헬퍼 (축, 격자)
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// 💡 5. 조명 설정
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 전체 조명
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5); // 점광원
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// 🟥 6. 카메라 위치 및 시점 설정
camera.position.set(2, 2, 2); // 카메라 위치
camera.lookAt(0, 0, 0);       // 씬 중심을 바라봄

// 🔁 7. 애니메이션 루프
function animate() {
    requestAnimationFrame(animate); // 다음 프레임 요청
    renderer.render(scene, camera); // 장면 렌더링
}
animate(); // 렌더링 시작
