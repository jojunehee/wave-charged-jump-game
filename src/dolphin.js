// dolphin.js
import * as THREE from 'three';

export function createDolphin() {
  const dolphin = new THREE.Group();

  // 몸통: 앞 얇고 뒤 굵은 Cylinder
  const bodyGeo = new THREE.CylinderGeometry(0.25, 0.4, 2.5, 32);
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0x70c1ff });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.rotation.z = Math.PI / 2;
  dolphin.add(body);

  // 머리: Sphere 반구 느낌
  const headGeo = new THREE.SphereGeometry(0.35, 32, 32);
  const head = new THREE.Mesh(headGeo, bodyMat);
  head.position.set(1.4, 0, 0);
  dolphin.add(head);

  // 등지느러미: Cone
  const topFinGeo = new THREE.ConeGeometry(0.08, 0.2, 16);
  const finMat = new THREE.MeshPhongMaterial({ color: 0x336699 });
  const topFin = new THREE.Mesh(topFinGeo, finMat);
  topFin.position.set(0.2, 0.3, 0);
  topFin.rotation.x = Math.PI;
  dolphin.add(topFin);

  // 옆지느러미 (왼쪽)
  const sideFinL = new THREE.Mesh(topFinGeo, finMat);
  sideFinL.scale.set(1, 0.8, 1);
  sideFinL.position.set(0, -0.2, -0.3);
  sideFinL.rotation.set(Math.PI / 2, 0.5, 0);
  dolphin.add(sideFinL);

  // 옆지느러미 (오른쪽)
  const sideFinR = sideFinL.clone();
  sideFinR.position.z = 0.3;
  sideFinR.rotation.y = -0.5;
  dolphin.add(sideFinR);

  // 꼬리 지느러미 (좌우 대칭)
  const tailGeo = new THREE.BoxGeometry(0.05, 0.3, 0.5);
  const tailL = new THREE.Mesh(tailGeo, finMat);
  tailL.position.set(-1.4, 0, -0.25);
  tailL.rotation.z = Math.PI / 6;
  dolphin.add(tailL);

  const tailR = tailL.clone();
  tailR.position.z = 0.25;
  tailR.rotation.z = -Math.PI / 6;
  dolphin.add(tailR);

  return dolphin;
}
