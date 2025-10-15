// 1. VAO_VBO
function showTriangle() {
    // Setup Step 1: Get the WebGL rendering context for our HTML canvas rendering area
    // The WebGL context is the object used to generate images via the WebGL API, and
    //  the canvas it is associated with is an area where those generated images will
    //  be placed by the browser once the JavaScript code is done working on it
    //  the HTML element below is a canvas.
    const canvas = document.getElementById('demo-canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        const isWebGl1Supported = !!(document.createElement('canvas')).getContext('webgl');
        if (isWebGl1Supported) {
            showError('WebGL 1 is supported, but not v2 - try using a different device or browser');
        }
        else {
            showError('WebGL is not supported on this device - try using a different device or browser');
        }
        return;
    }
    // Create the vertex and fragment shader. GLSL shader code is written as a plain JavaScript string, attached to        
    // a shader, and compiled with the "compileShader" call.
    // If both shaders compile successfully, attach them to a WebGLProgram instance
    // - vertex and fragment shaders must be used together in a draw call, 
    //and a WebGLProgram represents the combination of shaders to be used.
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
        const errorMessage = gl.getShaderInfoLog(vertexShader);
        showError(`Failed to compile vertex shader: ${errorMessage}`);
        return;
    }
    const fragmentShaderSourceCode = `#version 300 es
 precision mediump float;
 out vec4 outputColor;
 void main() {
 outputColor = vec4(0.294, 0.0, 0.51, 1.0);
 }`;
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        const errorMessage = gl.getShaderInfoLog(fragmentShader);
        showError(`Failed to compile fragment shader: ${errorMessage}`);
        return;
    }
    // When using WebGL, we always combine VertexShader and fragmentShader together and make a combined     
    //object called WebGL program.
    const TriangleProgram = gl.createProgram();
    gl.attachShader(TriangleProgram, vertexShader);
    gl.attachShader(TriangleProgram, fragmentShader);
    gl.linkProgram(TriangleProgram);
    if (!gl.getProgramParameter(TriangleProgram, gl.LINK_STATUS)) {
        const errorMessage = gl.getProgramInfoLog(TriangleProgram);
        showError(`Failed to link GPU program: ${errorMessage}`);
        return;
    }
    const vertices = new Float32Array([
        -0.9, -0.9, 0.0,
        0.85, -0.9, 0.0, 
        -0.9, 0.85, 0.0,
         0.9,  0.9, 0.0,
  -0.85, 0.9, 0.0,
   0.9, -0.85, 0.0,
    ]);
    // Create a Buffer Object (BO) containing the vertices thus named "Vertex Buffer Object (VBO)" in OpenGL
    const vbo = gl.createBuffer();
    // "Binding" the data means to set the data so that it can be used in GPU.
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    // Attribute locations allow us to talk about which shader input should read from 
    //which GPU buffer in the later "vertexAttribPointer" call.
    const vertexPositionAttributeLocation = gl.getAttribLocation(TriangleProgram, 'vertexPosition');
    if (vertexPositionAttributeLocation < 0) {
        showError(`Failed to get attribute location for vertexPosition`);
        return;
    }
    // Set up GPU program
    gl.useProgram(TriangleProgram);
    gl.enableVertexAttribArray(vertexPositionAttributeLocation);
    // Input assembler (how to read vertex information from buffers?)
    gl.vertexAttribPointer(
        vertexPositionAttributeLocation, /* index: vertex attrib location */
        3, /* size: number of components in the attribute */
        gl.FLOAT, /* type: type of data in the GPU buffer for this attribute */
        false, /* normalized vertex positon from -1.0 to 1.0 */
        3 * Float32Array.BYTES_PER_ELEMENT,/* stride*/
        0 /* offset: bytes between the start of the buffer and the first byte of the attribute */
    );
    // Output merger (how to apply an updated pixel to the output image)
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Rasterizer (which output pixels are covered by a triangle?)
    gl.viewport(0, 0, canvas.width, canvas.height);
    // Draw call (Primitive assembly (which vertices form triangles together?))
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
try {
    showTriangle();
}
catch (e) {
    showError(`Uncaught JavaScript exception: ${e}`);
}