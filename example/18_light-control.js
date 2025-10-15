// Light 예제 – 다양한 조명 타입을 적용하고 키보드로 On/Off 제어하기

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 🎬 씬 생성
const scene = new THREE.Scene();

// 📷 카메라 생성 (FOV 75도, 종횡비 설정, near/far 설정)
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 2, 10); // 카메라 위치 조정

// 🖥️ 렌더러 생성 및 DOM에 추가
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 🎮 OrbitControls – 마우스로 카메라를 회전할 수 있게 함
const orbitControls = new OrbitControls(camera, renderer.domElement);

// 🏠 방(박스)의 내부를 보는 구조로 설정 (BackSide 사용)
const roomGeometry = new THREE.BoxGeometry(15, 15, 15);
const roomMaterial = new THREE.MeshPhongMaterial({
    color: 0xa0adaf,
    side: THREE.BackSide // 안쪽 면만 보이도록
});
const room = new THREE.Mesh(roomGeometry, roomMaterial);
room.position.set(0, 7.5, 0); // 방이 바닥 위로 7.5만큼 올라와 있음
scene.add(room);

// 🔲 박스, 🔵 구, 🔺 원뿔 오브젝트 생성 및 배치
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshPhongMaterial({ color: 0xff1f3 })
);
cube.position.set(1, 1.5, 2);
scene.add(cube);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1),
    new THREE.MeshPhongMaterial({ color: 0x44f313 })
);
sphere.position.set(1, 1, -3);
scene.add(sphere);

const cone = new THREE.Mesh(
    new THREE.ConeGeometry(1, 3, 32),
    new THREE.MeshPhongMaterial({ color: 0xffff00 })
);
cone.position.set(-3, 1.5, 4);
scene.add(cone);

// 💡 조명 설정

// 1️⃣ Ambient Light – 전체 씬에 고르게 퍼지는 빛
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
ambientLight.name = 'ambient';
scene.add(ambientLight);

// 2️⃣ Directional Light – 태양처럼 한 방향으로 비추는 빛
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
directionalLight.name = 'directional';
scene.add(directionalLight);

// 3️⃣ Point Light – 전구처럼 주변으로 퍼지는 점광원
const pointLight = new THREE.PointLight(0xff0000, 10, 100);
pointLight.position.set(-2, 3, 2);
pointLight.name = 'point';
scene.add(pointLight);

// 4️⃣ Spot Light – 스포트라이트처럼 원뿔 모양으로 비추는 조명
const spotLight = new THREE.SpotLight(0x0000ff, 100);
spotLight.position.set(5, 5, 4);
spotLight.angle = Math.PI / 4; // 조명 퍼짐 각도
spotLight.penumbra = 0.1; // 경계 부드러움
spotLight.name = 'spot';
scene.add(spotLight);

// 🔘 초기에는 Ambient Light만 켜진 상태
ambientLight.visible = true;
directionalLight.visible = false;
pointLight.visible = false;
spotLight.visible = false;

// ⌨️ 키보드 이벤트로 조명 On/Off 전환
// '1' 키: Ambient Light
// '2' 키: Directional Light
// '3' 키: Point Light
// '4' 키: Spot Light
window.addEventListener('keydown', function (event) {
    switch (event.key) {
        case '1':
            ambientLight.visible = !ambientLight.visible;
            break;
        case '2':
            directionalLight.visible = !directionalLight.visible;
            break;
        case '3':
            pointLight.visible = !pointLight.visible;
            break;
        case '4':
            spotLight.visible = !spotLight.visible;
            break;
    }
});

// 🔁 렌더링 루프 – 씬을 계속 업데이트해서 보여줌
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
