// Three.js 라이브러리와 카메라 컨트롤(OrbitControls) 모듈을 불러옴
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// === [1] 씬, 카메라, 렌더러 생성 및 설정 ===
const scene = new THREE.Scene(); // 3D 공간을 표현할 씬 생성

const camera = new THREE.PerspectiveCamera(
  75, // 시야각(Field of View)
  window.innerWidth / window.innerHeight, // 종횡비 (aspect ratio)
  0.1, // near: 카메라가 볼 수 있는 가장 가까운 거리
  1000 // far: 카메라가 볼 수 있는 가장 먼 거리
);

const renderer = new THREE.WebGLRenderer(); // 웹 브라우저용 WebGL 렌더러 생성
const controls = new OrbitControls(camera, renderer.domElement); // 마우스 조작을 위한 궤도 컨트롤 추가

renderer.setSize(window.innerWidth, window.innerHeight); // 렌더러 크기를 브라우저 창 크기에 맞춤
document.body.appendChild(renderer.domElement); // 렌더링된 캔버스를 HTML 문서에 추가

// === [2] 초기 메시(mesh) 생성 (기본 도형: 정육면체 Box) ===
let geometry = new THREE.BoxGeometry(1, 1, 1); // 가로, 세로, 깊이 1인 정육면체 생성
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 기본 재질: 초록색 (광원 영향 없음)
let mesh = new THREE.Mesh(geometry, material); // geometry + material 로 메쉬 생성
scene.add(mesh); // 씬에 메쉬를 추가

// === [3] 카메라 위치 조정 ===
camera.position.z = 5; // 카메라를 z축 뒤로 이동시켜 메쉬가 보이도록 설정

// === [4] 도형 변경 함수 정의 ===

function cubeMesh() {
  // 정육면체(Box) 지오메트리로 변경
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  mesh.geometry = cubeGeometry;
}

function sphereMesh() {
  // 구(Sphere) 지오메트리로 변경
  // radius: 1, widthSegments: 16, heightSegments: 16
  const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
  mesh.geometry = sphereGeometry;
}

function cylinderMesh() {
  // 원기둥(Cylinder) 지오메트리로 변경
  // topRadius: 1, bottomRadius: 1, height: 1, radialSegments: 32
  const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 32);
  mesh.geometry = cylinderGeometry;
}

function torusMesh() {
  // 도넛 형태(Torus) 지오메트리로 변경
  // radius: 1, tube: 0.33, radialSegments: 16, tubularSegments: 100
  const torusGeometry = new THREE.TorusGeometry(1, 0.33, 16, 100);
  mesh.geometry = torusGeometry;
}

// === [5] 재질 변경 함수 정의 ===

function basicMaterial() {
  // 기본 재질: MeshBasicMaterial → 광원 영향 없음
  const basicMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  mesh.material = basicMaterial;
}

function normalMaterial() {
  // Normal 재질: 면의 법선 방향에 따라 색상이 자동 계산되는 시각적 재질
  const normalMaterial = new THREE.MeshNormalMaterial();
  mesh.material = normalMaterial;
}

// === [6] 와이어프레임 토글 함수 정의 ===

function wireFrame() {
  // 현재 적용된 재질의 wireframe 속성을 반전시킴
  // true → 선형 모드(뼈대만 보임), false → 면 렌더링
  mesh.material.wireframe = !mesh.material.wireframe;
}

// === [7] 키보드 입력 이벤트 처리 ===
// 특정 키를 누르면 도형 또는 재질을 전환
document.addEventListener('keydown', function (event) {
  switch (event.key) {
    case '1':
      cubeMesh();      // '1' 키 → 정육면체로 변경
      break;
    case '2':
      sphereMesh();    // '2' 키 → 구로 변경
      break;
    case '3':
      cylinderMesh();  // '3' 키 → 원기둥으로 변경
      break;
    case '4':
      torusMesh();     // '4' 키 → 도넛 형태로 변경
      break;
    case 'n':
      normalMaterial(); // 'n' 키 → 법선 재질 적용
      break;
    case 'b':
      basicMaterial();  // 'b' 키 → 기본 재질 적용
      break;
    case 'w':
      wireFrame();      // 'w' 키 → 와이어프레임 모드 토글
      break;
  }
});

// === [8] 렌더링 루프 (애니메이션 프레임 처리) ===
function animate() {
  requestAnimationFrame(animate); // 다음 프레임 렌더링 요청
  renderer.render(scene, camera); // 씬을 카메라 시점으로 렌더링
}

animate(); // 애니메이션 시작
