// Title: Interactive Two-Train System with Click-Based Movement and Collision Color Change
// Description: 두 개의 기차가 장면에 존재하며, 클릭 시 각각 랜덤하게 움직인다. 충돌하면 색이 바뀌고, 움직이는 기차를 다시 클릭하면 정지한다.

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 10, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement); // 카메라 마우스 회전 지원

// 조명 추가
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// 트레인 생성 함수
function createTrain(color = 'red') {
  const train = new THREE.Group();

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.5, 1),
    new THREE.MeshPhongMaterial({ color })
  );
  cabin.position.set(0, 0.75, 0);
  train.add(cabin);

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 2, 32),
    new THREE.MeshPhongMaterial({ color: 'gray' })
  );
  body.rotation.z = -Math.PI / 2;
  body.position.set(1.2, 0.5, 0);
  train.add(body);

  return train;
}

// 두 개의 기차 생성 및 위치 설정
const train1 = createTrain('blue');
train1.position.set(-5, 0, 0);
scene.add(train1);

const train2 = createTrain('green');
train2.position.set(5, 0, 0);
scene.add(train2);

// 상태 변수
const trains = [train1, train2];
const speeds = [new THREE.Vector3(), new THREE.Vector3()];
const active = [false, false];

// 클릭 처리
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([train1, train2], true);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    const parentTrain = trains.find(t => t.children.includes(obj) || t === obj.parent);
    const index = trains.indexOf(parentTrain);

    if (!active[index]) {
      // 랜덤 방향으로 이동 시작
      speeds[index].x = (Math.random() - 0.5) * 0.2;
      speeds[index].z = (Math.random() - 0.5) * 0.2;
      active[index] = true;
    } else {
      // 정지
      speeds[index].set(0, 0, 0);
      active[index] = false;
    }
  }
});

// 충돌 감지 함수 (AABB)
function checkCollision(objA, objB) {
  const boxA = new THREE.Box3().setFromObject(objA);
  const boxB = new THREE.Box3().setFromObject(objB);
  return boxA.intersectsBox(boxB);
}

// 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);

  // 각 기차 이동
  trains.forEach((train, idx) => {
    train.position.add(speeds[idx]);
  });

  // 충돌 체크
  if (checkCollision(train1, train2)) {
    train1.children[0].material.color.set('yellow');
    train2.children[0].material.color.set('yellow');
  } else {
    train1.children[0].material.color.set('blue');
    train2.children[0].material.color.set('green');
  }

  renderer.render(scene, camera);
}

animate();
