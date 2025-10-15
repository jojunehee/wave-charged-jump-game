// simple object — 기본 큐브와 조명, 카메라 설정 예제

// 🎯 주의할 점
// MeshBasicMaterial은 조명에 반응하지 않음
// → 조명을 추가했지만, 실제로 박스는 항상 같은 밝기로 보여.
// 👉 만약 조명의 영향을 받게 하고 싶다면 MeshStandardMaterial이나 MeshPhongMaterial을 사용하는 것이 좋아:
// let material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

import * as THREE from 'three'; // Three.js 라이브러리 import
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // 마우스로 카메라 조작 가능하게 해주는 컨트롤

// 🟦 1. 씬(Scene) 생성: 3D 오브젝트를 담는 공간
const scene = new THREE.Scene();

// 🟥 2. 카메라 생성: PerspectiveCamera(fov, aspect, near, far)
const camera = new THREE.PerspectiveCamera(
    75, // 시야각
    window.innerWidth / window.innerHeight, // 화면 비율
    0.1, // 가까운 클리핑 거리
    1000 // 먼 클리핑 거리
);

// 🟨 3. 렌더러 생성 및 HTML에 캔버스 추가
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // 브라우저 전체 크기로 설정
document.body.appendChild(renderer.domElement); // 렌더링 결과를 HTML 문서에 추가

// 🟧 4. 조명 설정
const amblight = new THREE.AmbientLight(0x404040, 20); // 주변 전체를 밝히는 은은한 조명 (강도 20)
scene.add(amblight);

const pointLight = new THREE.PointLight(0xffffff, 50, 100); // 한 점에서 퍼지는 광원
pointLight.position.set(5, 5, 5); // 광원 위치 설정
scene.add(pointLight); // 씬에 조명 추가

// 🌀 5. OrbitControls: 마우스로 카메라를 회전/확대/이동할 수 있도록 함
const controls = new OrbitControls(camera, renderer.domElement);

// 🧭 6. 카메라 위치 및 시점 설정
camera.position.z = 5; // z축 뒤로 이동
camera.position.y = 3; // y축 위로 올림
camera.lookAt(0, 0, 0); // 원점(0,0,0)을 바라보게 함

// 🟩 7. 기본 박스(1x1x1) 생성
let geometry = new THREE.BoxGeometry(1, 1, 1); // 정육면체 지오메트리
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 초록색 기본 재질 (조명 영향 X)
let mesh = new THREE.Mesh(geometry, material); // 지오메트리 + 재질 → 메쉬
scene.add(mesh); // 씬에 큐브 추가

// 🔁 8. 애니메이션 루프 정의
function animate() {
    requestAnimationFrame(animate); // 매 프레임마다 animate 반복 호출
    renderer.render(scene, camera); // 장면을 카메라 시점으로 렌더링
}
animate(); // 애니메이션 시작
