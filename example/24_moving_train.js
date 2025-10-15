// 🚂 Moving Train with Rolling Wheels and Directional Animation
// 기차 모델이 사각 경로를 따라 움직이며, 바퀴는 회전하고, 기차 방향과 카메라 방향이 함께 회전함

import * as THREE from 'three'; // Three.js의 모든 기능을 가져옴
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // 마우스로 카메라 조작하는 컨트롤러

// 1. 장면(scene), 카메라(camera), 렌더러(renderer) 생성
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,                        // 시야각(FOV, field of view)
  window.innerWidth / window.innerHeight, // 종횡비(aspect ratio)
  0.1,                       // 카메라가 볼 수 있는 가장 가까운 거리
  1000                       // 카메라가 볼 수 있는 가장 먼 거리
);
const renderer = new THREE.WebGLRenderer(); // 웹용 3D 렌더링 객체
renderer.setSize(window.innerWidth, window.innerHeight); // 캔버스 크기를 브라우저 창 크기에 맞춤
renderer.setClearColor(0xffffff); // 배경색 흰색
document.body.appendChild(renderer.domElement); // HTML 문서에 캔버스 추가

// 보조 도구 (좌표축과 격자)
scene.add(new THREE.AxesHelper(5)); // 좌표축 시각화 (X:빨강, Y:초록, Z:파랑)
scene.add(new THREE.GridHelper(30, 30)); // 바닥 격자

// 광원 설정
scene.add(new THREE.AmbientLight(0xffffff, 2)); // 주변광 (색상, 강도)
const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // 방향광
directionalLight.position.set(1, 2, 0); // 광원 위치
scene.add(directionalLight);

// 카메라 위치 조정
camera.position.set(0, 5, 0); // 위에서 기차를 내려다보는 위치
camera.lookAt(0, 0, 0);       // 장면 중심을 바라봄

// 마우스로 카메라 조작할 수 있게 함
const controls = new OrbitControls(camera, renderer.domElement);

// 🚂 기차 및 바퀴 그룹 생성
const trainGroup = new THREE.Group();         // 기차 전체 그룹
const frontWheelGroup = new THREE.Group();    // 앞바퀴 그룹
const centerWheelGroup = new THREE.Group();   // 가운데 바퀴 그룹
const rearWheelGroup = new THREE.Group();     // 뒷바퀴 그룹
scene.add(trainGroup);                        // 장면에 기차 추가
trainGroup.add(frontWheelGroup, centerWheelGroup, rearWheelGroup); // 기차 그룹에 바퀴 그룹 추가

// 🚃 기차 본체 구성
const boxGeometry = new THREE.BoxGeometry(1, 1.5, 1); // 너비 1, 높이 1.5, 깊이 1
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x191970, shininess: 80 }); // 어두운 파랑, 반짝임
const box = new THREE.Mesh(boxGeometry, boxMaterial); // 박스 메쉬 생성
trainGroup.add(box); // 기차 본체 추가

// 🚨 원뿔 (기차 뿔 또는 굴뚝처럼 표현)
const coneGeometry = new THREE.ConeGeometry(0.3, 0.4, 32); // 반지름 0.3, 높이 0.4, 세그먼트 32
const coneMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff, shininess: 80 }); // 밝은 청록
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(0, 0.3, -1.5); // 위치 조정 (앞쪽에 위치)
cone.rotation.set(Math.PI, 0, 0); // 위쪽이 아래로 향하게 회전
trainGroup.add(cone);

// 🚂 원통형 연결 부분 (기차 연결부처럼 보임)
const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 2), // 위아래 반지름 0.5, 높이 2
  new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 80 }) // 빨간색
);
cylinder.rotation.set(Math.PI / 2, 0, 0); // 눕힘 (x축 기준 90도)
cylinder.position.set(0, -0.25, -1);      // 살짝 아래쪽
trainGroup.add(cylinder);

// 💎 기차 전면의 장식 구체
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 32, 16, 0, Math.PI, 0, Math.PI / 2),
  new THREE.MeshBasicMaterial({ color: 0xADD8E6 }) // 연한 파랑
);
sphere.position.set(0, 0.3, -0.5);
trainGroup.add(sphere);

// 🛞 바퀴 생성 (토러스 형태)
const wheelGeometry = new THREE.TorusGeometry(0.15, 0.08, 7, 11); // 바깥반지름 0.15, 튜브 반지름 0.08
const bigwheel = new THREE.TorusGeometry(0.3, 0.15, 7, 11);       // 큰 바퀴 (뒷바퀴용)
const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00, shininess: 30 }); // 노란색

// 🛞 앞바퀴 2개
const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
frontWheelGroup.add(wheel1, wheel2);
frontWheelGroup.position.set(0, -0.5, -1.8);
wheel1.position.set(-0.5, 0, 0);
wheel2.position.set(0.5, 0, 0);
wheel1.rotation.y = wheel2.rotation.y = Math.PI / 2; // 바퀴 옆면이 보이게 회전

// 🛞 가운데 바퀴 2개
const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
centerWheelGroup.add(wheel3, wheel4);
centerWheelGroup.position.set(0, -0.5, -1.3);
wheel3.position.set(-0.5, 0, 0);
wheel4.position.set(0.5, 0, 0);
wheel3.rotation.y = wheel4.rotation.y = Math.PI / 2;

// 🛞 뒷바퀴 2개 (큰 바퀴)
const wheel5 = new THREE.Mesh(bigwheel, wheelMaterial);
const wheel6 = new THREE.Mesh(bigwheel, wheelMaterial);
rearWheelGroup.add(wheel5, wheel6);
rearWheelGroup.position.set(0, -0.5, 0.1);
wheel5.position.set(-0.5, 0, 0);
wheel6.position.set(0.5, 0, 0);
wheel5.rotation.y = wheel6.rotation.y = Math.PI / 2;

// 📍 기차가 이동할 경로 (사각형)
const points = [
  new THREE.Vector3(-10, 0, 0),
  new THREE.Vector3(0, 0, 10),
  new THREE.Vector3(10, 0, 0),
  new THREE.Vector3(0, 0, -10)
];
let currentSegment = 0;   // 현재 목표 위치 인덱스
const speed = 0.05;       // 기차 속도
let cone_direction = 1;   // 원뿔 상하 흔들림 방향 (1 또는 -1)

// 🚆 기차를 경로에 따라 이동시키고 바퀴 회전시키는 애니메이션 함수
function group_animation() {
  if (trainGroup.position.distanceTo(points[currentSegment]) < 0.25) {
    currentSegment = (currentSegment + 1) % points.length;
    cone_direction *= -1; // 방향 바꾸기
  }

  const targetPosition = points[currentSegment]; // 다음 목표 위치
  const direction = new THREE.Vector3().subVectors(targetPosition, trainGroup.position).normalize(); // 방향 벡터
  trainGroup.position.addScaledVector(direction, speed); // 이동

  // 바퀴 회전
  frontWheelGroup.rotation.x -= 0.01;
  centerWheelGroup.rotation.x -= 0.01;
  rearWheelGroup.rotation.x -= 0.01;

  // 원뿔 흔들기
  cone.position.y += 0.0007 * cone_direction;

  // 기차가 바라보는 방향 지정
  const lookAtTarget = new THREE.Vector3().addVectors(trainGroup.position, direction.multiplyScalar(-1));
  trainGroup.lookAt(lookAtTarget);
  camera.lookAt(trainGroup.position); // 카메라도 따라감
}

// 🎞 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);
  group_animation(); // 기차 이동 및 회전
  renderer.render(scene, camera); // 장면 렌더링
}
animate(); // 실행
