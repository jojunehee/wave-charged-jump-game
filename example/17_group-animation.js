// Group Animation – 여러 오브젝트를 그룹으로 묶어 경로를 따라 이동하며 개별 회전도 적용

import * as THREE from 'three';

// 🟩 1. 씬, 카메라, 렌더러 초기화
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

// 카메라 위치 조정 (멀리서 보기 위해 z축 뒤로)
camera.position.z = 20;

// 🟥 2. 기본 도형 3개 생성 (큐브, 구, 원뿔)
const cubeGeometry = new THREE.BoxGeometry(); // 정육면체
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // 빨강
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.x = -2;

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20); // 반지름 1짜리 구
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 초록
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 0;

const coneGeometry = new THREE.ConeGeometry(1, 2, 20); // 원뿔: 반지름 1, 높이 2
const coneMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // 파랑
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.x = 2;

// 🔷 3. 그룹 생성 및 오브젝트들 추가
const group = new THREE.Group();
group.add(cube);
group.add(sphere);
group.add(cone);
scene.add(group); // 그룹 자체를 씬에 추가

// 🧭 4. 이동 경로 지점 정의
const points = [
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(0, 10, 0),
    new THREE.Vector3(10, 0, 0)
];
let currentSegment = 0;    // 현재 목표 지점 인덱스
const speed = 0.05;        // 그룹 이동 속도
let cube_direction = 1;    // 구체 z축 움직임 방향 토글용

// 🎯 5. 애니메이션 함수
function group_animation() {
    // 현재 목표 지점에 가까워졌는지 확인
    if (group.position.distanceTo(points[currentSegment]) < 0.25) {
        currentSegment = (currentSegment + 1) % points.length;
        cube_direction *= -1; // 방향 반전
    }

    // 목표 위치 설정 및 방향 계산
    const targetPosition = points[currentSegment];
    const direction = new THREE.Vector3()
        .subVectors(targetPosition, group.position)
        .normalize();

    // 그룹 전체 이동
    group.position.addScaledVector(direction, speed);

    // 🔄 그룹 내부 개별 오브젝트 애니메이션
    cone.rotation.x += 0.1; // 원뿔 x축 회전
    cube.rotation.z -= 0.05; // 큐브 z축 회전
    sphere.position.z += 0.01 * cube_direction; // 구체 z축 진동

    // 그룹 전체가 진행 방향을 바라보도록 회전
    group.lookAt(targetPosition);
}

// 🔁 6. 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);
    group_animation();
    renderer.render(scene, camera);
}

// ▶️ 7. 시작
animate();
