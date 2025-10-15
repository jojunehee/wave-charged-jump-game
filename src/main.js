import * as THREE from 'three';

// 기본 요소 선언
let scene, camera, renderer;
let objects = [];  // 클릭 가능한 박스 객체들을 담는 배열
let raycaster, mouse;
let selectedObject = null;  // 현재 선택된 오브젝트
let offset = new THREE.Vector3();  // 마우스 클릭 지점과 오브젝트 위치 차이
let intersection = new THREE.Vector3();  // 평면과의 교차점 위치

scene = new THREE.Scene();
// D. 카메라 설정
camera = new THREE.PerspectiveCamera(
    85, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    500
);
camera.position.set(0, 0, 8); // 카메라 위치 조정


renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement);

// A. 빨간 구
const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({ 
    color: 'Red',     // 빨강
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
objects.push(sphere);
scene.add(sphere);

// B. 뒤집어진 콘
const coneGeometry = new THREE.ConeGeometry(2, 2, 100);
const coneMaterial = new THREE.MeshPhongMaterial({ 
    color: 'green',     // 빨강
});
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
scene.add(cone);
cone.rotation.x = Math.PI;
cone.position.set(5, 0, 0);
objects.push(cone);
scene.add(cone);

// C. 3d박스
let geometry = new THREE.BoxGeometry(2, 3, 4);
let material = new THREE.MeshPhongMaterial({ color: 'blue' }); // 노랑
let box = new THREE.Mesh(geometry, material); 
box.position.set(0, 5, 0);
objects.push(box);
scene.add(box);




// Ambient Light – 전체 씬에 고르게 퍼지는 빛
const ambientLight = new THREE.AmbientLight('red', 2);
ambientLight.name = 'ambient';
scene.add(ambientLight);

// Spot Light – 스포트라이트처럼 원뿔 모양으로 비추는 조명
const spotLight = new THREE.SpotLight('white', 100);
spotLight.position.set(2.5, 2.5, 5);
scene.add(spotLight);

// 둘다 켜진 상태
ambientLight.visible = true;
spotLight.visible = true;

// 조명 키보드 컨트롤
window.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'a':
            ambientLight.visible = !ambientLight.visible;
            break;
        case 's':
            spotLight.visible = !spotLight.visible;
            break;
    }
});




// 레이캐스터와 마우스 벡터 초기화
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

// 마우스 및 키보드 이벤트 등록
window.addEventListener('mousedown', onMouseDown, false);




// 마우스 위치 계산 함수
function updateMousePosition(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}


// 마우스를 눌렀을 때: 클릭한 오브젝트 선택
function onMouseDown(event) {
    event.preventDefault();
    updateMousePosition(event);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);
    selectedObject = intersects[0].object;

    selectedObject.material.color.set('red');
}


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
