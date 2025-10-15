// 충돌 감지 예제 – OBB(Oriented Bounding Box)를 이용한 AABB보다 정밀한 충돌 판정
import * as THREE from 'three';
import { OBB } from 'three/addons/math/OBB.js'; // OBB 유틸리티 모듈 불러오기

// 전역 변수 선언
let scene, camera, renderer;
let cube1, cube2, plane;
let obb1, obb2;
let moveSpeed = 0.01;
let keys = {};

// 🧱 씬 구성
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 바닥(Plane) 생성
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2; // 수평 바닥면
scene.add(plane);

// 🟩 움직일 큐브 (cube1) – 초록색
// 🟥 정지된 큐브 (cube2) – 빨간색
const geometry = new THREE.BoxGeometry(); // 정육면체
const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const material2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
cube1 = new THREE.Mesh(geometry, material1);
cube2 = new THREE.Mesh(geometry, material2);

// 위치 설정
cube1.position.set(-2, 0.5, 0);
cube2.position.set(2, 0.5, 0);
scene.add(cube1);
scene.add(cube2);

// 카메라 위치 설정
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// 🟨 OBB 생성 – 각 객체의 경계 상자를 기준으로 만듦
obb1 = new OBB().fromBox3(new THREE.Box3().setFromObject(cube1));
obb2 = new OBB().fromBox3(new THREE.Box3().setFromObject(cube2));

// 🔡 키보드 입력 처리 – 누를 때 true, 뗄 때 false
window.addEventListener('keydown', (event) => keys[event.key] = true);
window.addEventListener('keyup', (event) => keys[event.key] = false);

// 🔁 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);

    // ⌨️ WASD 키로 cube1 이동
    if (keys['w']) cube1.position.z -= moveSpeed;
    if (keys['s']) cube1.position.z += moveSpeed;
    if (keys['a']) cube1.position.x -= moveSpeed;
    if (keys['d']) cube1.position.x += moveSpeed;

    // 📦 OBB 위치 갱신 (cube 위치가 바뀌었기 때문에 다시 계산해야 함)
    obb1.copy(new OBB().fromBox3(new THREE.Box3().setFromObject(cube1)));
    obb2.copy(new OBB().fromBox3(new THREE.Box3().setFromObject(cube2)));

    // ❗ 충돌 판정
    const collision = obb1.intersectsOBB(obb2); // true or false

    // 색상 변경 (충돌 시 노란색, 아닐 시 원래 색상)
    if (collision) {
        cube1.material.color.set(0xffff00); // 노란색
        cube2.material.color.set(0xffff00);
    } else {
        cube1.material.color.set(0x00ff00); // 초록색
        cube2.material.color.set(0xff0000); // 빨간색
    }

    // 렌더링
    renderer.render(scene, camera);
}
animate(); // 애니메이션 시작
