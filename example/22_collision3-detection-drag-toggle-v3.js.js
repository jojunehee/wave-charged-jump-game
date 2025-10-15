// Collision Detection 3: 마우스 드래그와 충돌 감지 예제
import * as THREE from 'three';

// 기본 요소 선언
let scene, camera, renderer;
let plane;
let objects = [];  // 드래그 가능한 박스 객체들을 담는 배열
let raycaster, mouse;
let selectedObject = null;  // 현재 선택된 오브젝트
let offset = new THREE.Vector3();  // 마우스 클릭 지점과 오브젝트 위치 차이
let intersection = new THREE.Vector3();  // 평면과의 교차점 위치
let collisionEnabled = false;  // 충돌 감지 토글 상태

// 씬과 카메라, 렌더러 설정
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 바닥 평면 생성
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;  // 평면을 수평으로 회전
scene.add(plane);

// 랜덤 색상의 박스 5개 생성
const geometry = new THREE.BoxGeometry(1, 1, 1);
for (let i = 0; i < 5; i++) {
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
    const box = new THREE.Mesh(geometry, material);
    box.position.set((Math.random() - 0.5) * 5, 0.5, (Math.random() - 0.5) * 5);
    objects.push(box);
    scene.add(box);
}

// 카메라 위치 설정
camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);

// 레이캐스터와 마우스 벡터 초기화
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

// 마우스 및 키보드 이벤트 등록
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('keydown', onKeyDown, false);

// 렌더링 루프
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// 마우스를 눌렀을 때: 클릭한 오브젝트 선택
function onMouseDown(event) {
    event.preventDefault();
    updateMousePosition(event);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
        selectedObject = intersects[0].object;
        const planeIntersect = raycaster.intersectObject(plane);
        if (planeIntersect.length > 0) {
            offset.copy(planeIntersect[0].point).sub(selectedObject.position);
        }
    }
}

// 마우스를 움직일 때: 선택된 오브젝트 이동
function onMouseMove(event) {
    event.preventDefault();
    updateMousePosition(event);
    if (selectedObject) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(plane);
        if (intersects.length > 0) {
            intersection.copy(intersects[0].point).sub(offset);
            selectedObject.position.copy(intersection);

            // 충돌 감지 및 해결
            if (collisionEnabled) {
                for (let obj of objects) {
                    if (obj !== selectedObject && checkCollision(selectedObject, obj)) {
                        resolveCollision(selectedObject, obj);
                    }
                }
            }
        }
    }
}

// 마우스를 놓았을 때: 선택 해제
function onMouseUp(event) {
    event.preventDefault();
    selectedObject = null;
}

// 키보드 입력 처리 (1번 키로 충돌 감지 토글)
function onKeyDown(event) {
    if (event.key === '1') {
        collisionEnabled = !collisionEnabled;
        console.log(`Collision detection: ${collisionEnabled ? 'enabled' : 'disabled'}`);
    }
}

// 마우스 위치 계산 함수
function updateMousePosition(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

// AABB 충돌 감지 함수
function checkCollision(obj1, obj2) {
    const box1 = new THREE.Box3().setFromObject(obj1);
    const box2 = new THREE.Box3().setFromObject(obj2);
    return box1.intersectsBox(box2);
}

// 충돌 해결 함수 (단순히 겹침 방향으로 밀어냄)
function resolveCollision(obj1, obj2) {
    const box1 = new THREE.Box3().setFromObject(obj1);
    const box2 = new THREE.Box3().setFromObject(obj2);
    const overlapX = Math.min(box1.max.x - box2.min.x, box2.max.x - box1.min.x);
    const overlapZ = Math.min(box1.max.z - box2.min.z, box2.max.z - box1.min.z);

    if (overlapX < overlapZ) {
        obj1.position.x += (obj1.position.x < obj2.position.x ? -overlapX : overlapX);
    } else {
        obj1.position.z += (obj1.position.z < obj2.position.z ? -overlapZ : overlapZ);
    }
}

// 애니메이션 시작
animate();
