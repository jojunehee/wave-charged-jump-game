// Mouse handling in WebGL — 클릭하면 색상이 바뀌는 회전하는 큐브 예제

import * as THREE from 'three'; // Three.js 라이브러리 불러오기

// 🟩 1. 씬(scene), 카메라(camera), 렌더러(renderer) 생성
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,                                // 시야각
    window.innerWidth / window.innerHeight, // 화면 비율
    0.1,                               // near 클리핑 거리
    1000                               // far 클리핑 거리
);

const renderer = new THREE.WebGLRenderer(); // WebGL 기반 렌더러 생성
renderer.setSize(window.innerWidth, window.innerHeight); // 렌더러 크기 설정
document.body.appendChild(renderer.domElement); // canvas를 HTML 문서에 추가

// 🟦 2. 큐브 생성
const geometry = new THREE.BoxGeometry(); // 정육면체 형태의 지오메트리
const material = new THREE.MeshBasicMaterial(); // 기본 재질 (조명 영향 없음)

// 🟥 사용할 색상 배열 정의 (빨, 초, 파, 노, 자홍)
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];

// 현재 사용할 색상의 인덱스
let colorIndex = 0;
material.color.set(colors[colorIndex]); // 처음 색상 설정

// 메쉬 생성 후 씬에 추가
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 카메라를 z축 뒤로 이동시켜 큐브가 보이도록 설정
camera.position.z = 5;

// 🟨 3. 색상 변경 함수
function changeColor() {
    colorIndex = (colorIndex + 1) % colors.length; // 다음 색상으로 순환
    cube.material.color.set(colors[colorIndex]); // 색상 적용
}

// 🖱️ 4. 클릭 이벤트 처리: 마우스를 클릭하면 색상 변경
document.addEventListener('click', () => {
    changeColor();
});

// 🔁 5. 애니메이션 루프: 큐브를 계속 회전시키고 렌더링
function animate() {
    requestAnimationFrame(animate); // 매 프레임마다 재귀 호출

    // 큐브를 x, y축으로 조금씩 회전시킴
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera); // 씬을 카메라 시점으로 렌더링
}
animate(); // 애니메이션 시작
