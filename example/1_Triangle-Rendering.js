// Simple program (1) — A Simple Triangle Rendering with Three.js
// 삼각형 하나 그리는 법법
import * as THREE from 'three'; // three.js 라이브러리를 가져온다.

// 🟪 1. 장면 생성
const scene = new THREE.Scene(); // 장면(scene) 객체를 생성하여 렌더링할 모든 요소를 담는다.

// 🟩 2. 삼각형 Geometry 정의
const triangleGeometry = new THREE.BufferGeometry(); // 정점 정보를 직접 지정하는 버퍼 지오메트리 생성

// Float32Array: 3개의 정점을 정의 (각 정점은 x, y, z 좌표로 구성됨)
const vertices = new Float32Array([
    -0.9, 0.85, 0,   // 첫 번째 점 (왼쪽 위)
    -0.9, -0.9, 0,   // 두 번째 점 (왼쪽 아래)
    0.85, -0.9, 0    // 세 번째 점 (오른쪽 아래)
]);

// setAttribute(name, attribute):
// 'position'이라는 속성 이름으로, 정점 데이터를 설정
// new THREE.BufferAttribute(data, itemSize): itemSize가 3이면 [x, y, z]가 하나의 정점
triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

// 🟥 3. 삼각형 Material 정의
// MeshBasicMaterial은 빛에 영향을 받지 않는 단순한 재질
const triangleMaterial = new THREE.MeshBasicMaterial({
    color: 0x800080,       // 자주색 (퍼플)
    side: THREE.DoubleSide // 양면 렌더링
});

// 🟦 4. Geometry + Material → Mesh
// Mesh는 실제 장면에 추가할 수 있는 객체
const triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);

// 🟨 5. 장면에 Mesh 추가
scene.add(triangleMesh);

// 🟫 6. 카메라 설정
// PerspectiveCamera(fov, aspect, near, far)
// PerspectiveCamera(85,  window.innerWidth/window.innerHeight, 0.1, 500)
// fov: 시야각(도), aspect: 가로세로 비율, near/far: 렌더링 범위
const camera = new THREE.PerspectiveCamera(
    75,                         // fov: 75도 시야각
    window.innerWidth / window.innerHeight, // 종횡비 (화면 크기 기반)
    0.1,                        // near: 0.1 단위보다 가까운 객체는 렌더링 안됨
    1000                        // far: 1000 단위보다 먼 객체는 렌더링 안됨
);
camera.position.z = 5; // 카메라를 z축 뒤로 이동시켜 삼각형을 볼 수 있도록 함

// 🟧 7. 렌더러 생성 및 설정
const renderer = new THREE.WebGLRenderer(); // WebGL 기반 렌더러 생성
renderer.setSize(window.innerWidth, window.innerHeight); // 화면 크기에 맞게 렌더링 영역 설정
document.body.appendChild(renderer.domElement); // <canvas> 요소를 HTML 문서에 추가

// 🌀 8. 애니메이션 루프
function animate() {
    requestAnimationFrame(animate); // 브라우저에 다음 프레임 요청 (60fps)
    renderer.render(scene, camera); // 현재 장면을 카메라 시점으로 렌더링
}
animate(); // 애니메이션 시작
