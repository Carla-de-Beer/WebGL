var gl;

var isOrtho = true;
var isPerspective = false;
var isOblique = false;
var z = 0;
var rotSpeed = 1000.0;
var TetrahedronRot = 0;
var CubeRot = 0;
var delta = 0;

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function initGL(canvas){
	try {
		gl = canvas.getContext("webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e){
		alert(e);
	} if (!gl){
		alert("WebGL is not available");
	}
}

var shaderScript;

function getShader(gl, id){
	var shaderScript = document.getElementById(id);

	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k){
		if (k.nodeType == 3) {
			str += k.textContent;
		}

		k = k.nextSibling;
	}

	var shader;

	if (shaderScript.type == "x-shader/x-fragment"){
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	}
	else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	}
	else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

var shaderProgram;

function initShaders(){
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
		alert("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function mvPushMatrix() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

function mvPopMatrix() {
	if (mvMatrixStack.length == 0) {
		throw "Invalid popMatrix!";
	}
	mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms(){
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

var cubeVertexPositionBuffer;
var cubeVertexColorBuffer;
var cubeVertexIndexBuffer;

var tetrahedronVertexPositionBuffer;
var tetrahedronVertexColorBuffer;

function initBuffers(){

	// --------------- Cube

	var vertices = [
			// Front face
			-1.0, -1.0,  1.0,
			1.0, -1.0,  1.0,
			1.0,  1.0,  1.0,
			-1.0,  1.0,  1.0,

			// Back face
			-1.0, -1.0, -1.0,
			-1.0,  1.0, -1.0,
			1.0,  1.0, -1.0,
			1.0, -1.0, -1.0,

			// Top face
			-1.0,  1.0, -1.0,
			-1.0,  1.0,  1.0,
			1.0,  1.0,  1.0,
			1.0,  1.0, -1.0,

			// Bottom face
			-1.0, -1.0, -1.0,
			1.0, -1.0, -1.0,
			1.0, -1.0,  1.0,
			-1.0, -1.0,  1.0,

			// Right face
			1.0, -1.0, -1.0,
			1.0,  1.0, -1.0,
			1.0,  1.0,  1.0,
			1.0, -1.0,  1.0,

			// Left face
			-1.0, -1.0, -1.0,
			-1.0, -1.0,  1.0,
			-1.0,  1.0,  1.0,
			-1.0,  1.0, -1.0
		];

	cubeVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	cubeVertexPositionBuffer.itemSize = 3;
	cubeVertexPositionBuffer.numItems = 24;

	colors = [
		// Front face
		0.5, 0.3, 0.7, 1.0,
		1.0, 1.0, 1.0, 1.0,
		0.2, 1.0, 0.3, 1.0,
		1.0, 0.0, 0.0, 1.0,

		// Back face
		0.2, 1.0, 0.3, 1.0,
		1.0, 1.0, 1.0, 1.0,
		0.5, 0.3, 0.7, 1.0,
		1.0, 0.0, 0.0, 1.0,

		// Top face
		1.0, 1.0, 1.0, 1.0,
		1.0, 0.0, 0.0, 1.0,
		0.2, 1.0, 0.3,1.0,
		0.5, 0.3, 0.7, 1.0,

		// Bottom face
		0.2, 1.0, 0.3, 1.0,
		1.0, 0.0, 0.0, 1.0,
		1.0, 1.0, 1.0, 1.0,
		0.5, 0.3, 0.7, 1.0,

		// Right face
		1.0, 0.0, 0.0, 1.0,
		0.5, 0.3, 0.7, 1.0,
		0.2, 1.0, 0.3, 1.0,
		1.0, 1.0, 1.0, 1.0,

		// Left face
		0.2, 1.0, 0.3, 1.0,
		0.5, 0.3, 0.7, 1.0,
		1.0, 0.0, 0.0, 1.0,
		1.0, 1.0, 1.0, 1.0

	];

	cubeVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	cubeVertexColorBuffer.itemSize = 4;
	cubeVertexColorBuffer.numItems = 24;

	var cubeVertexIndices = [
		0, 1, 2,      0, 2, 3,
		4, 5, 6,      4, 6, 7,
		8, 9, 10,     8, 10, 11,
		12, 13, 14,   12, 14, 15,
		16, 17, 18,   16, 18, 19,
		20, 21, 22,   20, 22, 23
	];

	cubeVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
	cubeVertexIndexBuffer.itemSize = 1;
	cubeVertexIndexBuffer.numItems = 36;

	// --------------- Tetrahedron

	vertices = [
		// Front face
		0.0,  1.0,  0.0,
		-1.0, -1.0,  1.0,
		1.0, -1.0,  1.0,

		// Second face
		0.0,  1.0,  0.0,
		1.0, -1.0, 1.0,
		1.0, -1.0, -1.0,

		// Back face
		0.0,  1.0,  0.0,
		-1.0, -1.0, 1.0,
		1.0, -1.0, -1.0,

		// Left face
		-1.0,  -1.0, 1.0,
		1.0,  -1.0, 1.0,
		1.0,  -1.0, -1.0
	];

	var colors = [
			[1.0, 0.2, 0.1, 1.0],  // Front face - red
			[1.0, 0.6, 0.2, 1.0],  // Second face - yellow
			[0.35, 0.35, 0.35, 1.0],  // Bottom face - grey
			[1.0, 0.45, 0.3, 1.0] // Left face - pink
		];

	var unpackedColors = [];
	for (var i in colors){
		var color = colors[i];
		for (var j=0; j < 3; j++) {
			unpackedColors = unpackedColors.concat(color);
		}
	}

	tetrahedronVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tetrahedronVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	tetrahedronVertexPositionBuffer.itemSize = 3;
	tetrahedronVertexPositionBuffer.numItems = 12;

	colors = [
		// Front face
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,

		// Right face
		1.0, 0.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		0.0, 1.0, 0.0, 1.0,

		// Back face
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,

		// Left face
		1.0, 0.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		0.0, 1.0, 0.0, 1.0
	];

	tetrahedronVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tetrahedronVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
	tetrahedronVertexColorBuffer.itemSize = 4;
	tetrahedronVertexColorBuffer.numItems = 12;
}

function drawScene() {

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.identity(pMatrix);

	if(isOrtho){
		mat4.ortho(-2.0, 2.0, -2.0, 2.0, 0.1, 100, pMatrix);
	}
	else if(isPerspective){

		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	}
	else if(isOblique){
		mat4.oblique(-2.0, 2.0, -2.0, 2.0, 0.1, 550, pMatrix, 90, 95);
	}


	// --------------- Cube1 --------------------------

	mat4.identity(mvMatrix);

	mvPushMatrix();

	mat4.translate(mvMatrix, [-0.25, -0.25, -2.0 + z]);

	mat4.rotate(mvMatrix, degreesToRadians(CubeRot), [0, 1, 0]);
	mat4.scale(mvMatrix, [0.2, 0.2, 0.2]);

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

	setMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();


	// --------------- Cube2 --------------------------

	mat4.identity(mvMatrix);

	mvPushMatrix();

	mat4.translate(mvMatrix, [-1.25, -0.25, -30.0 + z]);

	mat4.rotate(mvMatrix, degreesToRadians(CubeRot), [0, 1, 0]);
	mat4.scale(mvMatrix, [0.2, 0.2, 0.2]);

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);

	setMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------- Tetrahedron1 -------------------

	mvPushMatrix();

	mat4.translate(mvMatrix, [1.0, 1.0, -15.0 + z]);
	mat4.rotate(mvMatrix, degreesToRadians(TetrahedronRot), [0, 1, 0]);
	mat4.scale(mvMatrix, [0.25, 0.25, 0.25]);

	gl.bindBuffer(gl.ARRAY_BUFFER, tetrahedronVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, tetrahedronVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, tetrahedronVertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, tetrahedronVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();

	gl.drawArrays(gl.TRIANGLES, 0, tetrahedronVertexPositionBuffer.numItems);

	mvPopMatrix();

	// --------------- Tetrahedron2 -------------------

	mvPushMatrix();

	mat4.translate(mvMatrix, [1.0, -1.0, -5.0 + z]);
	mat4.rotate(mvMatrix, degreesToRadians(TetrahedronRot), [0, 1, 0]);
	mat4.scale(mvMatrix, [0.25, 0.25, 0.25]);

	gl.bindBuffer(gl.ARRAY_BUFFER, tetrahedronVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, tetrahedronVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, tetrahedronVertexColorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, tetrahedronVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();

	gl.drawArrays(gl.TRIANGLES, 0, tetrahedronVertexPositionBuffer.numItems);

	mvPopMatrix();

	document.getElementById('isO_ON').onclick = function() {
		isOrtho = true;
		isPerspective = false;
		isOblique = false;
	};

	document.getElementById('isP_ON').onclick = function() {
		isPerspective = true;
		isOrtho = false;
		isOblique = false;
	};

	document.getElementById('isOb_ON').onclick = function() {
		isPerspective = false;
		isOrtho = false;
		isOblique = true;
	};

	document.getElementById('inc').onclick = function() {
		z+=0.5;
	};

	document.getElementById('dec').onclick = function() {
		z-=0.5;
	};

}

function animate(){
	var date = new Date();
	var timeCurrent = date.getTime();

	if (delta != 0) {
		var timeElapsed = timeCurrent - delta;
		TetrahedronRot += (40 * timeElapsed) / rotSpeed;
		CubeRot += (40 * timeElapsed) / rotSpeed;
	}
	delta = timeCurrent;
}

function tick() {
	getAnimationFrame(tick);
	drawScene();
	animate();
}

function webGLStart() {

	var canvas = document.getElementById("gl-canvas");
	initGL(canvas);
	initShaders();
	initBuffers();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	tick();
}