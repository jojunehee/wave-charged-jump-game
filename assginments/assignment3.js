import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 3, 5);
camera.lookAt(0, 0.5, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//파란 기관실
const cabin = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1.5, 1),
  new THREE.MeshPhongMaterial({ color: 'blue' })
);
cabin.position.set(0, 0.75, 0);
scene.add(cabin);

//빨간 실린더
const body = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 2, 32),
  new THREE.MeshPhongMaterial({ color: 'red' })
);
body.rotation.z = Math.PI / 2;
body.position.set(-1.2, 0.5, 0);
scene.add(body);

//연통
const funnel = new THREE.Mesh(
  new THREE.ConeGeometry(0.25, 0.5, 32),
  new THREE.MeshPhongMaterial({ color: 0x000000 })
);
funnel.position.set(-1.95, 1.0, 0);
funnel.rotation.x = Math.PI;
scene.add(funnel);

//둥?근창문
const dome = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2),
  new THREE.MeshPhongMaterial({ color: 'skyblue' })
);
dome.position.set(-0.4, 1.1, 0);
scene.add(dome);

//작은 바퀴
const smallWheelGeo = new THREE.TorusGeometry(0.2, 0.1, 16, 100);
const smallWheelMat = new THREE.MeshPhongMaterial({ color: 'gray' });
[
  [-1.9, 0.15, -0.5], [-1.9, 0.15, 0.5],
  [-1.2, 0.15, -0.5], [-1.2, 0.15, 0.5]
].forEach(pos => {
  const wheel = new THREE.Mesh(smallWheelGeo, smallWheelMat);
  wheel.rotation.set(0, 0, Math.PI / 2);
  wheel.position.set(...pos);
  scene.add(wheel);
});

//큰 바퀴
const bigWheelGeo = new THREE.TorusGeometry(0.3, 0.15, 16, 100);
[
  [0.0, 0.3, -0.5], [0.0, 0.3, 0.5]
].forEach(pos => {
  const wheel = new THREE.Mesh(bigWheelGeo, smallWheelMat);
  wheel.rotation.set(0, 0, Math.PI / 2);
  wheel.position.set(...pos);
  scene.add(wheel);
});

//조명
scene.add(new THREE.AmbientLight(0xffffff,1));
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);
//핼퍼 굿
scene.add(new THREE.AxesHelper(5));
scene.add(new THREE.GridHelper(10, 10));
//카메라
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
//랜더링
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
