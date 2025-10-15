// Simple program (2): Rendering Basic 3D Objects with Lights and Rotation in Three.js
// 큐브, 구, 도넛(토러스) 3가지 3D 오브젝트를 생성하고, 회전 애니메이션과 조명 효과까지
import * as THREE from 'three'; // Three.js의 핵심 기능 import
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // 마우스로 카메라 조작 가능하게 하는 컨트롤러

// 1️⃣ Scene 생성: 3D 객체들을 담을 공간
const scene = new THREE.Scene();

// 2️⃣ 카메라 생성: PerspectiveCamera(fov, aspect, near, far)
// - fov: 시야각, aspect: 화면비, near/far: 렌더링 거리 범위
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);

// 3️⃣ WebGL 렌더러 설정 및 HTML에 추가
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // 화면 전체 크기로 설정
document.body.appendChild(renderer.domElement); // 렌더링된 canvas를 문서에 삽입

// 4️⃣ 배경색 설정 (연한 회색)
scene.background = new THREE.Color(0xD3D3D3);

// 5️⃣ 기본 Geometry 생성
const boxGeometry = new THREE.BoxGeometry(); // 기본 큐브 (1x1x1)
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32); // 반지름 0.5, 세부 분할 32x32
const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100); // 도넛: 반지름 0.5, 튜브 반지름 0.2, 외곽을 몇조각:16, 튜브를 따라 몇조각:100

// 6️⃣ 각 Mesh에 사용할 Material 정의
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // 빛을 받는 표면 재질 (녹색)
const sphereMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffd733,     // 노란색
    metalness: 1,        // 금속성 (1: 완전 금속)
    roughness: 0.5       // 표면 거칠기
});
const torusMaterial = new THREE.MeshPhongMaterial({ color: 0x0088ff }); // 파란색 도넛

// 7️⃣ Geometry + Material → Mesh (렌더링 가능한 실제 객체)
const cube = new THREE.Mesh(boxGeometry, boxMaterial);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
const torus = new THREE.Mesh(torusGeometry, torusMaterial);

// 8️⃣ 오브젝트 배치: 기본 큐브는 가운데, 나머지 이동
sphere.position.x = 2;  // 오른쪽
torus.position.x = -2; // 왼쪽

// 9️⃣ Scene에 추가
scene.add(cube);
scene.add(sphere);
scene.add(torus);

// 🔟 조명 추가
// AmbientLight(색상, 세기): 전체적으로 고르게 퍼지는 은은한 조명
const amblight = new THREE.AmbientLight(0x404040, 20); 
scene.add(amblight);

// PointLight(색상, 세기, 범위): 한 점에서 나오는 빛
const pointLight = new THREE.PointLight(0xffffff, 50, 100); 
pointLight.position.set(0, 5, 5); // 약간 위에서 비추도록 배치
scene.add(pointLight);

// 🔄 카메라 위치 조정
camera.position.z = 5; // z축 뒤에서 바라보게 설정

// 🖱️ OrbitControls: 마우스로 카메라를 회전/줌/이동 가능하게 함
const controls = new OrbitControls(camera, renderer.domElement);

// ♻️ 애니메이션 루프
function animate() {
    requestAnimationFrame(animate); // 매 프레임마다 이 함수 호출

    // 오브젝트 회전 설정
    cube.rotation.x += 0.01; cube.rotation.y += 0.01;
    sphere.rotation.x -= 0.01; sphere.rotation.y -= 0.02;
    torus.rotation.x += 0.03; torus.rotation.y += 0.02;

    // 장면 렌더링
    renderer.render(scene, camera);
}
animate(); // 애니메이션 시작
