import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    85, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    500
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement);

// A. 빨간 구
const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ 
    color: 'Red',     // 빨강
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// B. 뒤집어진 콘
const funnel = new THREE.Mesh(
  new THREE.ConeGeometry(5, 5, 100),
  new THREE.MeshNormalMaterial()
);
funnel.rotation.x = Math.PI;
funnel.position.set(10, 0, 0);
scene.add(funnel);

// C. 3d박스
let geometry = new THREE.BoxGeometry(3, 4, 5);
let material = new THREE.MeshBasicMaterial({ color: 'yellow' }); // 노랑
let box = new THREE.Mesh(geometry, material); 
box.position.set(0, 10, 0);
scene.add(box);


//배경색
scene.background = new THREE.Color(0xD3D3D3);

// 조명 
const amblight = new THREE.AmbientLight(0x404040, 20); 
scene.add(amblight);


// 🔄 카메라 위치 조정
camera.position.z = 8; // z축 뒤에서 바라보게 설정


// F. 키보드 r누를 시 원래 위치 (0,0,8) 로 이동
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'r':
            camera.position.set(0,0,8);
            break;
        default:
            break; // 다른 키는 무시
    }
});


// E. 트레킹 추가 alt + 마우스 가운데 버튼
let isTracking = false; 
let lastMouseX = 0;
let lastMouseY = 0;

renderer.domElement.addEventListener('mousedown', function (event) {
    if (event.altKey && event.button === 1) {
        isTracking = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
});
document.addEventListener('mouseup', function (event) {
    isTracking = false;
});

// 카메라 위치 업데이트 함수수
function updateCamera(deltaX, deltaY) {
    camera.position.x -= deltaX * 0.01;
    camera.position.y += deltaY * 0.01; 
    camera.updateProjectionMatrix();
}

renderer.domElement.addEventListener('mousemove', function (event) {
    if (isTracking) {
        const deltaX = event.clientX - lastMouseX;
        const deltaY = event.clientY - lastMouseY;

        updateCamera(deltaX, deltaY);
        
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
