// 1. VAO_VBO 기반 WebGL2 삼각형 렌더링 함수
// 딱히 쓸일 없다고 하셨는데 잘 모르겠음
function showTriangle() {
    // 🟩 1단계: HTML <canvas> 요소에서 WebGL2 렌더링 컨텍스트 얻기
    const canvas = document.getElementById('demo-canvas');
    const gl = canvas.getContext('webgl2');

    // WebGL2 지원 안 할 경우 오류 처리
    if (!gl) {
        const isWebGl1Supported = !!(document.createElement('canvas')).getContext('webgl');
        if (isWebGl1Supported) {
            showError('WebGL 2는 지원하지 않지만 WebGL 1은 지원됩니다. 다른 브라우저를 사용해 보세요.');
        } else {
            showError('WebGL이 이 기기에서 지원되지 않습니다.');
        }
        return;
    }

    // 🟦 2단계: 셰이더 소스 코드 정의 및 컴파일

    // 정점 셰이더: 각 정점의 위치를 정의함
    const vertexShaderSourceCode = `#version 300 es
    precision mediump float;
    in vec3 vertexPosition;
    void main() {
        gl_Position = vec4(vertexPosition, 1.0);
    }`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSourceCode);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        showError(`Vertex Shader 컴파일 실패: ${gl.getShaderInfoLog(vertexShader)}`);
        return;
    }

    // 프래그먼트 셰이더: 픽셀 색상 출력 정의
    const fragmentShaderSourceCode = `#version 300 es
    precision mediump float;
    out vec4 outputColor;
    void main() {
        outputColor = vec4(0.294, 0.0, 0.51, 1.0); // 보라색(RGB) 출력
    }`;

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        showError(`Fragment Shader 컴파일 실패: ${gl.getShaderInfoLog(fragmentShader)}`);
        return;
    }

    // 🟨 3단계: 셰이더 프로그램 생성 및 연결
    const TriangleProgram = gl.createProgram();
    gl.attachShader(TriangleProgram, vertexShader);
    gl.attachShader(TriangleProgram, fragmentShader);
    gl.linkProgram(TriangleProgram);
    if (!gl.getProgramParameter(TriangleProgram, gl.LINK_STATUS)) {
        showError(`GPU 프로그램 링크 실패: ${gl.getProgramInfoLog(TriangleProgram)}`);
        return;
    }

    // 🟥 4단계: 삼각형의 정점 좌표 배열 생성 (Float32Array)
    const vertices = new Float32Array([
        -0.9, -0.9, 0.0,  // 좌측 하단
         0.85, -0.9, 0.0, // 우측 하단
        -0.9,  0.85, 0.0  // 좌측 상단
    ]);

    // 🟫 5단계: GPU에 정점 데이터를 저장할 VBO(Vertex Buffer Object) 생성
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo); // 현재 사용하는 버퍼로 바인딩
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // 정점 데이터 업로드

    // 🟪 6단계: 정점 셰이더에서 사용할 입력(attribute)의 위치 확인
    const vertexPositionAttributeLocation = gl.getAttribLocation(TriangleProgram, 'vertexPosition');
    if (vertexPositionAttributeLocation < 0) {
        showError('vertexPosition attribute 위치를 찾을 수 없습니다.');
        return;
    }

    // 🟨 7단계: 셰이더 프로그램 사용 설정 및 VBO를 어떻게 읽을지 정의
    gl.useProgram(TriangleProgram); // 이 프로그램으로 렌더링 수행
    gl.enableVertexAttribArray(vertexPositionAttributeLocation); // 해당 attribute 사용 가능하게 설정

    gl.vertexAttribPointer(
        vertexPositionAttributeLocation,  // attribute 위치
        3,                                // size: 3개 구성요소 (x, y, z)
        gl.FLOAT,                         // type: 부동소수점
        false,                            // normalize: 정규화 안 함
        3 * Float32Array.BYTES_PER_ELEMENT, // stride: 정점 하나당 크기 (x, y, z)
        0                                 // offset: 시작 위치
    );

    // 🟦 8단계: 뷰포트 및 배경색 설정
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.08, 0.08, 0.08, 1.0); // 어두운 회색 배경
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 🟧 9단계: 실제로 삼각형 그리기!
    gl.drawArrays(gl.TRIANGLES, 0, 3); // 정점 배열에서 0번부터 3개를 사용해 삼각형 렌더링
}

// 예외 발생 시 에러 메시지 표시
try {
    showTriangle();
} catch (e) {
    showError(`예상치 못한 예외 발생: ${e}`);
}
