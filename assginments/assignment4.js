import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 기차 묶기
const train = new THREE.Group();

// 기관실
const cabin = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1.5, 1),
  new THREE.MeshPhongMaterial({ color: 'blue' })
);
cabin.position.set(0, 0.75, 0);
train.add(cabin);

// 실린더 본체
const body = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 2, 32),
  new THREE.MeshPhongMaterial({ color: 'red' })
);
body.rotation.z = -Math.PI / 2;
body.position.set(1.2, 0.5, 0);
train.add(body);

// 연통
const funnel = new THREE.Mesh(
  new THREE.ConeGeometry(0.25, 0.5, 32),
  new THREE.MeshPhongMaterial({ color: 0x000000 })
);
funnel.position.set(1.95, 1.0, 0);
funnel.rotation.x = Math.PI;
train.add(funnel);

// 창문
const dome = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2),
  new THREE.MeshPhongMaterial({ color: 'skyblue' })
);
dome.position.set(0.4, 1.1, 0);
train.add(dome);

// 바퀴
const wheelMat = new THREE.MeshPhongMaterial({ color: 'gray' });
const wheels = []; // 회전 대상 그룹 저장

// 도넛 조금 비우기기
function createOpenWheel(radius, tube, thetaLength, material, position) {
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 16, 100, thetaLength),
    material
  );
  torus.rotation.set(0, 0, Math.PI / 2); // 눕히기

  const wheelGroup = new THREE.Group();
  wheelGroup.add(torus);
  wheelGroup.position.set(...position);

  return wheelGroup;
}

// 바퀴 구성
const openTorusAngle = Math.PI * 1.8; // 90% 도넛
const smallWheelPositions = [
  [1.9, 0.15, -0.5], [1.9, 0.15, 0.5],
  [1.2, 0.15, -0.5], [1.2, 0.15, 0.5]
];
const bigWheelPositions = [
  [0.0, 0.3, -0.5], [0.0, 0.3, 0.5]
];

// 작은 바퀴
smallWheelPositions.forEach(pos => {
  const wheel = createOpenWheel(0.2, 0.1, openTorusAngle, wheelMat, pos);
  train.add(wheel);
  wheels.push(wheel);
});

// 큰 바퀴
bigWheelPositions.forEach(pos => {
  const wheel = createOpenWheel(0.3, 0.15, openTorusAngle, wheelMat, pos);
  train.add(wheel);
  wheels.push(wheel);
});

scene.add(train);

// 조명
scene.add(new THREE.AmbientLight(0xffffff, 1));
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// 가이드선 
scene.add(new THREE.AxesHelper(5));
scene.add(new THREE.GridHelper(10, 10));

// 이동 속도, 거리 설정
let moveDirection = new THREE.Vector3(1, 0, 0);
let segmentLength = 10;
let lastTurnPosition = new THREE.Vector3().copy(train.position);

const points = [
  new THREE.Vector3(0, 0, 0),            
  new THREE.Vector3(10, 0, 0),           
  new THREE.Vector3(5, 0, 8.6602540378)   
];

let turnCount = 0;

function animate() {
  requestAnimationFrame(animate);

  const speed = 0.02;
  train.position.add(moveDirection.clone().multiplyScalar(speed));

  const wheelRotationAmount = speed / 0.2;
  wheels.forEach(wheel => {
    wheel.rotation.z -= wheelRotationAmount;
  });

  const distance = train.position.distanceTo(lastTurnPosition);
  if (distance >= segmentLength) {
    const turnAngle = -Math.PI * 2 / 3;
    train.rotation.y += turnAngle;
    moveDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), turnAngle);
    lastTurnPosition.copy(train.position);
    turnCount++; // 우회전 횟수 증가
  }

  // 카메라 제어
  const section = turnCount % 3;

  if (section === 0) {


  const trainUp = new THREE.Vector3(0, 1, 0);
  const sideOffset = new THREE.Vector3().crossVectors(trainUp, moveDirection).normalize().multiplyScalar(5); 



  const cameraPosition = train.position.clone().add(sideOffset);
  camera.position.copy(cameraPosition);

  camera.lookAt(train.position);
} else {
    camera.position.set(points[2].x, points[2].y+0.5, points[2].z);
    const target = train.position.clone().add(new THREE.Vector3(0, 0.5, 0)); //현재 카메라가 트레인 포지션 따라가면 약간 트레인 바닥 중심 정도를 보는 듯. 통과해서 딱 지나가려면 트레인 포지션 클론해서 0.5 올려줘야 야함
    camera.lookAt(target);
  }

  renderer.render(scene, camera);
}

animate();