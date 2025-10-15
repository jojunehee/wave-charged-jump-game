// 🔶 Collision Detection 2: 점(Point)과 박스(Box), 구(Sphere)의 충돌 감지 예제
// THREE.js의 AABB (Box3)와 Bounding Sphere 기법을 사용하여 충돌 여부를 판단함

import * as THREE from 'three';

let scene, camera, renderer;
let box, sphere, point;
let moveSpeed = 0.1; // 점(Point)의 이동 속도
let keys = {}; // 방향키 입력 상태를 저장할 객체

// 🟦 씬(Scene), 카메라(Camera), 렌더러(Renderer) 초기 설정
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(
    75,                                // 시야각 (FOV)
    window.innerWidth / window.innerHeight, // 종횡비
    0.1,                               // near clipping plane
    1000                               // far clipping plane
);
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // 화면 크기 설정
document.body.appendChild(renderer.domElement);          // 캔버스를 DOM에 추가

// 🟥 Box 생성
const boxGeometry = new THREE.BoxGeometry(2, 2, 2); // 너비, 높이, 깊이
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 기본 색: 녹색
box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(-3, 1, 0); // 위치 지정
scene.add(box);

// 🟠 Sphere 생성
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32); // 반지름 1, 세분화 32
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // 기본 색: 빨강
sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(3, 1, 0);
scene.add(sphere);

// 🔵 Point 생성 (작은 구체로 표현)
const pointGeometry = new THREE.SphereGeometry(0.1, 32, 32); // 매우 작은 반지름
const pointMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // 파란색
point = new THREE.Mesh(pointGeometry, pointMaterial);
point.position.set(0, 1, 0); // 초기 위치
scene.add(point);

// 📷 카메라 위치 지정 및 방향 설정
camera.position.set(0, 5, 10);
camera.lookAt(0, 1, 0);

// ⌨️ 방향키 입력 처리 (눌림 상태 저장)
window.addEventListener('keydown', (event) => keys[event.key] = true);
window.addEventListener('keyup', (event) => keys[event.key] = false);

// 🎞️ 애니메이션 루프 함수
function animate() {
    requestAnimationFrame(animate);

    // 방향키에 따라 점(Point) 이동
    if (keys['ArrowUp']) point.position.z -= moveSpeed;    // ↑ : Z축 -
    if (keys['ArrowDown']) point.position.z += moveSpeed;  // ↓ : Z축 +
    if (keys['ArrowLeft']) point.position.x -= moveSpeed;  // ← : X축 -
    if (keys['ArrowRight']) point.position.x += moveSpeed; // → : X축 +

    // 충돌 검사 함수 호출
    detectCollision();

    // 화면 렌더링
    renderer.render(scene, camera);
}

// 🚨 충돌 검사 함수
function detectCollision() {
    const pointVector = new THREE.Vector3().copy(point.position); // 점의 위치 복사

    // 📦 Box 충돌 감지: AABB (Axis-Aligned Bounding Box) 방식 사용
    const box3 = new THREE.Box3().setFromObject(box); 
    // 👉 Box3: 객체 외곽의 최소-최대 범위 계산
    // containsPoint: 특정 포인트가 이 박스 내부에 있는지 확인
    if (box3.containsPoint(pointVector)) {
        box.material.color.set(0xffff00); // 충돌 시: 노란색
    } else {
        box.material.color.set(0x00ff00); // 충돌 아님: 원래 색
    }

    // ⚪ Sphere 충돌 감지: Bounding Sphere 방식 사용
    const sphereBoundingSphere = new THREE.Sphere(sphere.position, 1);
    // 👉 Sphere: 중심 좌표 + 반지름으로 정의된 경계 구
    // containsPoint: 반지름 내에 포인트가 들어오는지 확인
    if (sphereBoundingSphere.containsPoint(pointVector)) {
        sphere.material.color.set(0xffff00); // 충돌 시: 노란색
    } else {
        sphere.material.color.set(0xff0000); // 충돌 아님: 원래 색
    }
}

// 🔁 애니메이션 시작
animate();
