import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 7;

//도형 변수 선언
let box = null;
let sphere = null;
let cylinder = null;
let torus = null;

//도형 초기 위치
const boxPos = new THREE.Vector3(-4, 0, 0);
const spherePos = new THREE.Vector3(-1.3, 0, 0);
const cylinderPos = new THREE.Vector3(1.3, 0, 0);
const torusPos = new THREE.Vector3(4, 0, 0);

//키보드로 도형 생성 1234
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case '1':
            if (box === null) {
                const geometry = new THREE.BoxGeometry();
                const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                box = new THREE.Mesh(geometry, material);
                box.position.copy(boxPos);
                scene.add(box);
            }
            break;
        case '2':
            if (sphere === null) {
                const geometry = new THREE.SphereGeometry(0.7, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                sphere = new THREE.Mesh(geometry, material);
                sphere.position.copy(spherePos);
                scene.add(sphere);
            }
            break;
        case '3':
            if (cylinder === null) {
                const geometry = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 32);
                const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                cylinder = new THREE.Mesh(geometry, material);
                cylinder.position.copy(cylinderPos);
                scene.add(cylinder);
            }
            break;
        case '4':
            if (torus === null) {
                const geometry = new THREE.TorusGeometry(0.7, 0.3, 16, 100);
                const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                torus = new THREE.Mesh(geometry, material);
                torus.position.copy(torusPos);
                scene.add(torus);
            }
            break;

        //box 이동 awsd
        case 'w': if (box) box.position.y += 0.1; break;
        case 's': if (box) box.position.y -= 0.1; break;
        case 'a': if (box) box.position.x -= 0.1; break;
        case 'd': if (box) box.position.x += 0.1; break;

        // sphere tfgh
        case 't': if (sphere) sphere.position.y += 0.1; break;
        case 'g': if (sphere) sphere.position.y -= 0.1; break;
        case 'f': if (sphere) sphere.position.x -= 0.1; break;
        case 'h': if (sphere) sphere.position.x += 0.1; break;

        // cylinder ijkl
        case 'i': if (cylinder) cylinder.position.y += 0.1; break;
        case 'k': if (cylinder) cylinder.position.y -= 0.1; break;
        case 'j': if (cylinder) cylinder.position.x -= 0.1; break;
        case 'l': if (cylinder) cylinder.position.x += 0.1; break;
    }
});

//색상값
const colorList = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
//색상 순환용
let colorIndex = 0;

// 클릭 시 색상 변경
document.addEventListener('click', () => {
    colorIndex = (colorIndex + 1) % 5;

    let colorHex = 0x00ff00;

    switch (colorIndex) {
        case 0:
            colorHex = 0xff0000; // Red
            break;
        case 1:
            colorHex = 0x00ff00; // Green
            break;
        case 2:
            colorHex = 0x0000ff; // Blue
            break;
        case 3:
            colorHex = 0xffff00; // Yellow
            break;
        case 4:
            colorHex = 0xff00ff; // Magenta
            break;
    }

    if (box) box.material.color.set(colorHex);
    if (sphere) sphere.material.color.set(colorHex);
    if (cylinder) cylinder.material.color.set(colorHex);
    if (torus) torus.material.color.set(colorHex);
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
