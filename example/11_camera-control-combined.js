// Camera control (Dolly, Tumble and Track) — 마우스를 이용한 3가지 카메라 제어

// Dolly, Tumble, Track 세 가지 카메라 제어를 모두 구현한 통합 예제야.
// 사용자의 마우스 입력에 따라 아래 기능이 작동해:

// 🖱️ Alt + Left Click → Tumble (회전)

// 🖱️ Alt + Middle Click → Track (평행 이동)

// 🖱️ 마우스 휠 → Dolly (앞뒤 이동)


import * as THREE from 'three'; // Three.js 라이브러리 불러오기

// 🟩 1. 씬, 카메라, 렌더러 설정
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 🟦 2. 큐브 오브젝트 생성 및 위치 설정
var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
cube.position.set(10, 5, -10); // 큐브를 임의의 위치에 배치
scene.add(cube);

// 🟥 3. 초기 카메라 위치
camera.position.z = 5;

// 🧭 4. 시각적 헬퍼 추가 (축과 격자)
const axesHelper = new THREE.AxesHelper(15);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(50, 50);
scene.add(gridHelper);

// 🟨 5. 카메라 제어 상태 변수들
let isInteracting = false;
let lastMouseX = 0;
let lastMouseY = 0;
let mode = ''; // 'tumble', 'track', 또는 '' (없음)

// 🟪 6. 카메라의 기준 회전 중심점 (orbitPoint)
// 카메라의 현재 위치 + 시선 방향 * 거리 (5단위 앞)
let orbitPoint = new THREE.Vector3()
    .copy(camera.position)
    .add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(5));

// 🖱️ 7. 마우스 버튼 눌렀을 때: 모드 설정
renderer.domElement.addEventListener('mousedown', function (event) {
    if (event.altKey) { // Alt 키를 누르고 있어야 작동
        isInteracting = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;

        switch (event.button) {
            case 0: // 왼쪽 버튼 → 회전 (Tumble)
                mode = 'tumble';
                break;
            case 1: // 가운데 버튼 → 평행 이동 (Track)
                mode = 'track';
                break;
        }
    }
});

// 마우스 놓을 때: 인터랙션 종료
renderer.domElement.addEventListener('mouseup', function () {
    isInteracting = false;
});

// 마우스 움직일 때: Tumble 또는 Track 처리
renderer.domElement.addEventListener('mousemove', function (event) {
    if (!isInteracting) return;

    const deltaX = event.clientX - lastMouseX;
    const deltaY = event.clientY - lastMouseY;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;

    if (mode === 'tumble') {
        // 🔁 회전 각도 계산
        let angleX = deltaX * 0.001;
        let angleY = deltaY * 0.001;

        // 회전을 Euler → Matrix4로 적용
        let euler = new THREE.Euler(-angleY, -angleX, 0, 'YXZ');
        let rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(euler);

        // 카메라 위치 → 중심점 기준으로 회전
        let vector = new THREE.Vector3().subVectors(camera.position, orbitPoint);
        vector.applyMatrix4(rotationMatrix);
        camera.position.copy(vector.add(orbitPoint));
        camera.lookAt(orbitPoint); // 항상 orbitPoint 바라보게
    } else if (mode === 'track') {
        // 📦 카메라의 오른쪽/위쪽 방향 벡터 계산
        const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0)
            .multiplyScalar(-deltaX * 0.01);
        const up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1)
            .multiplyScalar(deltaY * 0.01);

        // 카메라와 중심점 둘 다 평행이동
        camera.position.add(right).add(up);
        orbitPoint.add(right).add(up);
    }
});

// 🔍 마우스 휠: 앞으로/뒤로 이동 (Dolly)
renderer.domElement.addEventListener('wheel', function (event) {
    event.preventDefault();

    const delta = event.deltaY * -0.01; // 스크롤 방향 반전
    camera.translateZ(delta);          // 카메라의 로컬 z축 방향으로 이동
    camera.lookAt(orbitPoint);         // 중심점은 그대로 바라봄
});

// 🔁 8. 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate(); // 시작
