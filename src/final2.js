import * as THREE from 'three';

const scene = new THREE.Scene();
// D. 카메라 설정
const camera = new THREE.PerspectiveCamera(
    85, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    500
);
camera.position.set(0, 0, 8); // 카메라 위치 조정


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement);

// A. 빨간 구
const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({ 
    color: 'Red',     // 빨강
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// B. 뒤집어진 콘
const coneGeometry = new THREE.ConeGeometry(2, 2, 100);
const coneMaterial = new THREE.MeshBasicMaterial({ 
    color: 'green',     // 빨강
});
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
scene.add(cone);
cone.rotation.x = Math.PI;
cone.position.set(5, 0, 0);
scene.add(cone);

// C. 3d박스
let geometry = new THREE.BoxGeometry(2, 3, 4);
let material = new THREE.MeshBasicMaterial({ color: 'blue' }); // 노랑
let box = new THREE.Mesh(geometry, material); 
box.position.set(0, 5, 0);
scene.add(box);




// 1️⃣ Ambient Light – 전체 씬에 고르게 퍼지는 빛
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
ambientLight.name = 'ambient';
scene.add(ambientLight);

// 4️⃣ Spot Light – 스포트라이트처럼 원뿔 모양으로 비추는 조명
const spotLight = new THREE.SpotLight(0x0000ff, 100);
spotLight.position.set(5, 5, 4);
spotLight.angle = Math.PI / 4; // 조명 퍼짐 각도
spotLight.penumbra = 0.1; // 경계 부드러움
spotLight.name = 'spot';
scene.add(spotLight);

// 🔘 초기에는 Ambient Light만 켜진 상태
ambientLight.visible = true;
spotLight.visible = true;


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


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
