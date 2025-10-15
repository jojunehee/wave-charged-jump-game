// Collision Detection 4: 중력, 반발력, 공 간 충돌 포함된 물리 시뮬레이션
import * as THREE from 'three';

// 🔷 씬, 카메라, 렌더러 초기 설정
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 🔷 바닥(Plane) 생성
const floorGeometry = new THREE.PlaneGeometry(20, 20); // 20x20 크기
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2; // 수평으로 회전
floor.position.y = -5; // y = -5 위치에 놓음
scene.add(floor);

// 🔷 카메라 위치 설정
camera.position.set(0, 5, 15);
camera.lookAt(0, 0, 0);

// 🔷 공 객체 리스트 및 물리 상수
const balls = [];
const gravity = -9.8;  // 중력 가속도
const damping = 0.8;   // 반발 계수 (바닥 반사 시)

// 🔵 공 클래스 정의
class Ball {
    constructor(x, y, z) {
        this.geometry = new THREE.SphereGeometry(0.5, 32, 32); // 반지름 0.5
        this.material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }); // 랜덤 색상
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(x, y, z); // 초기 위치 설정
        scene.add(this.mesh);
        this.velocity = new THREE.Vector3(0, 0, 0); // 초기 속도는 0
    }
}

// 🔵 공 추가 함수 (Space 키 입력 시 호출)
function addBall() {
    const ball = new Ball(0, 5, 0); // y=5에서 떨어지도록 생성
    balls.push(ball);
}

// 🔵 키보드 입력 저장용 객체
const keyState = {};
document.addEventListener('keydown', (event) => {
    keyState[event.code] = true;
    if (event.code === 'Space') addBall(); // Space 키로 공 추가
});
document.addEventListener('keyup', (event) => {
    keyState[event.code] = false;
});

// 🔵 키보드 방향키 조작 (마지막 생성된 공만 이동)
function handleKeyboardInput() {
    if (balls.length === 0) return;
    const latestBall = balls[balls.length - 1];
    const speed = 0.1;
    if (keyState['ArrowLeft']) latestBall.velocity.x -= speed;
    if (keyState['ArrowRight']) latestBall.velocity.x += speed;
    if (keyState['ArrowUp']) latestBall.velocity.z -= speed;
    if (keyState['ArrowDown']) latestBall.velocity.z += speed;
}

// 🔴 공과 공 사이 충돌 감지 및 반응
function checkCollision(ball1, ball2) {
    const distance = ball1.mesh.position.distanceTo(ball2.mesh.position); // 중심 간 거리
    if (distance < 1) { // 반지름 합보다 가까우면 충돌
        const normal = new THREE.Vector3().subVectors(ball2.mesh.position, ball1.mesh.position).normalize(); // 충돌 방향
        const relativeVelocity = new THREE.Vector3().subVectors(ball1.velocity, ball2.velocity); // 속도 차이
        const speed1 = ball1.velocity.length();
        const speed2 = ball2.velocity.length();

        // 더 빠른 쪽이 반작용 벡터 전달
        if (speed1 > speed2) {
            ball2.velocity.add(normal.multiplyScalar(relativeVelocity.dot(normal)));
        } else {
            ball1.velocity.sub(normal.multiplyScalar(relativeVelocity.dot(normal)));
        }
    }
}

// 🔄 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);

    // 방향키 제어
    handleKeyboardInput();

    // 물리 연산 및 충돌 처리
    balls.forEach(ball => {
        // 중력 적용
        ball.velocity.y += gravity * 0.016; // 프레임당 시간 고려
        ball.mesh.position.add(ball.velocity.clone().multiplyScalar(0.016)); // 위치 갱신

        // 바닥 충돌 처리
        if (ball.mesh.position.y - 0.5 < floor.position.y) {
            ball.mesh.position.y = floor.position.y + 0.5;
            ball.velocity.y = -ball.velocity.y * damping; // 반사 후 감쇠
        }

        // 벽 충돌 처리 (X/Z)
        if (Math.abs(ball.mesh.position.x) > 10) {
            ball.velocity.x = -ball.velocity.x;
        }
        if (Math.abs(ball.mesh.position.z) > 10) {
            ball.velocity.z = -ball.velocity.z;
        }
    });

    // 공 간 충돌 처리
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            checkCollision(balls[i], balls[j]);
        }
    }

    // 렌더링
    renderer.render(scene, camera);
}
animate(); // 애니메이션 시작
