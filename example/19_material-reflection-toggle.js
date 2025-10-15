// Materials 예제 – 확산 반사와 정반사 재질 비교

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js'; // 카메라 회전용 컨트롤

// 🧱 씬 생성
const scene = new THREE.Scene();

// 🎥 카메라 생성
const camera = new THREE.PerspectiveCamera(
    75,                                // FOV
    window.innerWidth / window.innerHeight, // 종횡비
    0.1,                               // near
    1000                               // far
);
camera.position.z = 5; // 카메라 z축 뒤로

// 🖥️ 렌더러 설정
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 🎮 카메라 마우스 조작
const orbitControls = new OrbitControls(camera, renderer.domElement);

// 💡 조명 설정

// Ambient Light – 전체적으로 밝히는 부드러운 조명
const ambientLight = new THREE.AmbientLight(0x404040, 10);
scene.add(ambientLight);

// Directional Light – 방향성 조명 (태양빛처럼)
const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Point Light – 점광원 (전구처럼 퍼지는 조명)
const pointLight = new THREE.PointLight(0xffffff, 100, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// 🧵 확산 반사 재질 (Lambert: 부드럽고 반짝임 없음)
const diffuseMaterial = new THREE.MeshLambertMaterial({
    emissive: 0x072534, // 자발광 색상 (빛과 무관하게 자체 발광)
    color: 0x156289     // 확산 색상 (기본 색)
});

// ✨ 정반사 재질 (Phong: 하이라이트 포함, 반짝임 존재)
const specularMaterial = new THREE.MeshPhongMaterial({
    color: 0x156289,       // 확산 색상
    emissive: 0x072534,    // 자발광 색상
    specular: 0xffffff,    // 정반사 하이라이트 색상
    shininess: 100,        // 하이라이트 크기 조절
    flatShading: false     // true일 경우 면 단위 그림자
});

// 🟩 큐브 생성 (기본은 diffuseMaterial 사용)
const geometry = new THREE.BoxGeometry(2, 2, 2);
const cube = new THREE.Mesh(geometry, diffuseMaterial);
scene.add(cube);

// 🟠 구 – 정반사 없는 Phong 재질
const sphereGeometry = new THREE.SphereGeometry(1);
const sphereMaterial = new THREE.MeshPhongMaterial({
    color: 0x896215,
    emissive: 0x072534,
    specular: 0x000000,  // 반짝임 없음
    shininess: 0
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-3, 0, 0);
scene.add(sphere);

// 🔺 원뿔 – 정반사 강한 Phong 재질
const coneGeometry = new THREE.ConeGeometry(1, 3, 32);
const coneMaterial = new THREE.MeshPhongMaterial({
    color: 0x891562,
    emissive: 0x072534,
    specular: 0xffffff,
    shininess: 100,
    flatShading: false
});
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(3, 0, 0);
scene.add(cone);

// ⌨️ 키보드 입력 처리 – 큐브 재질 전환
window.addEventListener('keydown', function (event) {
    if (event.key === 'd' || event.key === 'D') {
        // 'D' 입력: 확산 반사 재질로 전환
        cube.material = diffuseMaterial;
    } else if (event.key === 's' || event.key === 'S') {
        // 'S' 입력: 정반사 재질로 전환
        cube.material = specularMaterial;
    }
});

// 🔁 애니메이션 루프 – 큐브 회전
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
