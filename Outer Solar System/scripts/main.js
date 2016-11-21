var gl;

function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL!");
	}
}

function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
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
var pointShaderProgram;
var bumpShaderProgram;

function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

	shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
	shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
	shaderProgram.materialShininessUniform = gl.getUniformLocation(shaderProgram, "uMaterialShininess");
	shaderProgram.showSpecularHighlightsUniform = gl.getUniformLocation(shaderProgram, "uShowSpecularHighlights");
	shaderProgram.useTexturesUniform = gl.getUniformLocation(shaderProgram, "uUseTextures");
	shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
	shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
	shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
	shaderProgram.pointLightingSpecularColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingSpecularColor");
	shaderProgram.pointLightingDiffuseColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingDiffuseColor");
	shaderProgram.pointLightingColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingColor");
}

function pointLightInitShaders() {
	var fragmentShader = getShader(gl, "pointLightShader-fs");
	var vertexShader = getShader(gl, "pointLightShader-vs");

	pointShaderProgram = gl.createProgram();
	gl.attachShader(pointShaderProgram, vertexShader);
	gl.attachShader(pointShaderProgram, fragmentShader);
	gl.linkProgram(pointShaderProgram);

	if (!gl.getProgramParameter(pointShaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.useProgram(pointShaderProgram);

	pointShaderProgram.vertexPositionAttribute =gl.getAttribLocation(pointShaderProgram, "aVertexPosition_point");
	gl.enableVertexAttribArray(pointShaderProgram.vertexPositionAttribute);

	pointShaderProgram.vertexNormalAttribute = gl.getAttribLocation(pointShaderProgram, "aVertexNormal_point");
	gl.enableVertexAttribArray(pointShaderProgram.vertexNormalAttribute);

	pointShaderProgram.textureCoordAttribute = gl.getAttribLocation(pointShaderProgram, "aTextureCoord_point");
	gl.enableVertexAttribArray(pointShaderProgram.textureCoordAttribute);

	pointShaderProgram.pMatrixUniform = gl.getUniformLocation(pointShaderProgram, "uPMatrix_point");
	pointShaderProgram.mvMatrixUniform = gl.getUniformLocation(pointShaderProgram, "uMVMatrix_point");
	pointShaderProgram.nMatrixUniform = gl.getUniformLocation(pointShaderProgram, "uNMatrix_point");
	pointShaderProgram.samplerUniform = gl.getUniformLocation(pointShaderProgram, "uSampler");
	pointShaderProgram.useTexturesUniform = gl.getUniformLocation(pointShaderProgram, "uUseTextures_point");
	pointShaderProgram.useLightingUniform = gl.getUniformLocation(pointShaderProgram, "uUseLighting_point");
	pointShaderProgram.ambientColorUniform = gl.getUniformLocation(pointShaderProgram, "uAmbientColor_point");
	pointShaderProgram.pointLightingLocationUniform = gl.getUniformLocation(pointShaderProgram, "uPointLightingLocation_point");
	pointShaderProgram.pointLightingColorUniform = gl.getUniformLocation(pointShaderProgram, "uPointLightingColor_point");
}

function bumpInitShaders() {

	var bumpFragmentShader = getShader(gl, "bumpShader-fs");
	var bumpVertexShader = getShader(gl, "bumpShader-vs");

	bumpShaderProgram = gl.createProgram();
	gl.attachShader(bumpShaderProgram, bumpVertexShader);
	gl.attachShader(bumpShaderProgram, bumpFragmentShader);
	gl.linkProgram(bumpShaderProgram);

	if (!gl.getProgramParameter(bumpShaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.useProgram(bumpShaderProgram);

	bumpShaderProgram.bumpVertexPositionAttribute = gl.getAttribLocation(bumpShaderProgram, "bumpVertexPositionAttribute");
	gl.enableVertexAttribArray(bumpShaderProgram.bumpVertexPositionAttribute);

	bumpShaderProgram.bumpVextureCoordAttribute = gl.getAttribLocation(bumpShaderProgram, "bumpVextureCoordAttribute");
	gl.enableVertexAttribArray(bumpShaderProgram.bumpVextureCoordAttribute);

	bumpShaderProgram.light_z = gl.getUniformLocation(bumpShaderProgram, "light_z");
	bumpShaderProgram.rho = gl.getUniformLocation(bumpShaderProgram, "rho");
	bumpShaderProgram.bump_scale = gl.getUniformLocation(bumpShaderProgram, "bump_scale");
	bumpShaderProgram.delta_s = gl.getUniformLocation(bumpShaderProgram, "delta_s");
	bumpShaderProgram.delta_t = gl.getUniformLocation(bumpShaderProgram, "delta_t");
	bumpShaderProgram.viewport_aspect = gl.getUniformLocation(bumpShaderProgram, "viewport_aspect");
	bumpShaderProgram.texture_aspect = gl.getUniformLocation(bumpShaderProgram, "texture_aspect");
	bumpShaderProgram.texture_coord_scale = gl.getUniformLocation(bumpShaderProgram, "texture_coord_scale");
	bumpShaderProgram.diffuse_material = gl.getUniformLocation(bumpShaderProgram, "diffuse_material");

	bumpShaderProgram.pMatrixUniform = gl.getUniformLocation(bumpShaderProgram, "uPMatrix");
	bumpShaderProgram.mvMatrixUniform = gl.getUniformLocation(bumpShaderProgram, "uMVMatrix");
	bumpShaderProgram.nMatrixUniform = gl.getUniformLocation(bumpShaderProgram, "uNMatrix");
	bumpShaderProgram.samplerUniform = gl.getUniformLocation(bumpShaderProgram, "bumpUSampler");
}

function handleLoadedTexture(texture) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

var starTexture;
var ioTexture;
var europaTexture;
var ganymedeTexture;
var jupiterTexture;
var saturnTexture;
var ringTexture;
var titanTexture;
var uranusTexture;
var neptuneTexture;


function initTexture() {

	ioTexture = gl.createTexture();
	ioTexture.image = new Image();
	ioTexture.image.onload = function () {
		handleLoadedTexture(ioTexture)
	};

	ioTexture.image.src = "Images/io.jpg";

	// -------------------------------------------

	europaTexture = gl.createTexture();
	europaTexture.image = new Image();
	europaTexture.image.onload = function () {
		handleLoadedTexture(europaTexture)
	};

	europaTexture.image.src = "Images/europa.jpg";

	// -------------------------------------------

	ganymedeTexture = gl.createTexture();
	ganymedeTexture.image = new Image();
	ganymedeTexture.image.onload = function () {
		handleLoadedTexture(ganymedeTexture)
	};

	ganymedeTexture.image.src = "Images/ganymede.jpg";

	// -------------------------------------------

	jupiterTexture = gl.createTexture();
	jupiterTexture.image = new Image();
	jupiterTexture.image.onload = function () {
		handleLoadedTexture(jupiterTexture)
	};

	jupiterTexture.image.src = "Images/jupiter.jpg";

	// -------------------------------------------

	saturnTexture = gl.createTexture();
	saturnTexture.image = new Image();
	saturnTexture.image.onload = function () {
		handleLoadedTexture(saturnTexture)
	};

	saturnTexture.image.src = "Images/saturn.jpg";

	// -------------------------------------------

	ringTexture = gl.createTexture();
	ringTexture.image = new Image();
	ringTexture.image.onload = function () {
		handleLoadedTexture(ringTexture)
	};

	ringTexture.image.src = "Images/rings.jpg";

	// -------------------------------------------

	titanTexture = gl.createTexture();
	titanTexture.image = new Image();
	titanTexture.image.onload = function () {
		handleLoadedTexture(titanTexture)
	};

	titanTexture.image.src = "Images/titan.jpg";

	// -------------------------------------------

	uranusTexture = gl.createTexture();
	uranusTexture.image = new Image();
	uranusTexture.image.onload = function () {
		handleLoadedTexture(uranusTexture)
	};

	uranusTexture.image.src = "Images/uranus.jpg";

	// -------------------------------------------

	neptuneTexture = gl.createTexture();
	neptuneTexture.image = new Image();
	neptuneTexture.image.onload = function () {
		handleLoadedTexture(neptuneTexture)
	};

	neptuneTexture.image.src = "Images/neptune.jpg";

	// -------------------------------------------

	starTexture = gl.createTexture();
	starTexture.image = new Image();
	starTexture.image.onload = function () {
		handleLoadedTexture(starTexture)
	};

	starTexture.image.src = "Images/stars3.jpg";
}

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

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

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

	var normalMatrix = mat3.create();
	mat4.toInverseMat3(mvMatrix, normalMatrix);
	mat3.transpose(normalMatrix);
	gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

function pointSetMatrixUniforms() {
	gl.uniformMatrix4fv(pointShaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(pointShaderProgram.mvMatrixUniform, false, mvMatrix);

	var normalMatrix = mat3.create();
	mat4.toInverseMat3(mvMatrix, normalMatrix);
	mat3.transpose(normalMatrix);
	gl.uniformMatrix3fv(pointShaderProgram.nMatrixUniform, false, normalMatrix);
}

function bumpSetMatrixUniforms() {
	gl.uniformMatrix4fv(bumpShaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(bumpShaderProgram.mvMatrixUniform, false, mvMatrix);

	var normalMatrix = mat3.create();
	mat4.toInverseMat3(mvMatrix, normalMatrix);
	mat3.transpose(normalMatrix);
	gl.uniformMatrix3fv(bumpShaderProgram.nMatrixUniform, false, normalMatrix);
}

function degToRad(degrees) {
	return degrees * Math.PI / 180;
}

var currentlyPressedKeys = {};

function handleKeyDown(event) {
	currentlyPressedKeys[event.keyCode] = true;
}
function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;
}

var pitch = 0;
var pitchRate = 0;

var yaw = 0;
var yawRate = 0;

var xPos = 0;
var yPos = 0.0;
var zPos = 0;

var speed = 0;

function handleKeys() {
	if (currentlyPressedKeys[33]) {
		// Page Up
		pitchRate = 0.1;
	} else if (currentlyPressedKeys[34]) {
		// Page Down
		pitchRate = -0.1;
	} else {
		pitchRate = 0;
	}

	if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
		// Left cursor key or A
		yawRate = 0.1;
	} else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
		// Right cursor key or D
		yawRate = -0.1;
	} else {
		yawRate = 0;
	}

	if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
		// Up cursor key or W
		speed = 0.003;
	} else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
		// Down cursor key
		speed = -0.003;
	} else {
		speed = 0;
	}
}

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

var ioRotationMatrix = mat4.create();
mat4.identity(ioRotationMatrix);

var europaRotationMatrix = mat4.create();
mat4.identity(europaRotationMatrix);

var ganymedeRotationMatrix = mat4.create();
mat4.identity(ganymedeRotationMatrix);

var jupiterRotationMatrix = mat4.create();
mat4.identity(jupiterRotationMatrix);

var saturnRotationMatrix = mat4.create();
mat4.identity(saturnRotationMatrix);

var ringRotationMatrix = mat4.create();
mat4.identity(ringRotationMatrix);

var titanRotationMatrix = mat4.create();
mat4.identity(titanRotationMatrix);

var uranusRotationMatrix = mat4.create();
mat4.identity(uranusRotationMatrix);

var neptuneRotationMatrix = mat4.create();
mat4.identity(neptuneRotationMatrix);

function handleMouseDown(event) {
	mouseDown = true;
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
}

function handleMouseUp(event) {
	mouseDown = false;
}

function handleMouseMove(event) {
	if (!mouseDown) {
		return;
	}
	var newX = event.clientX;
	var newY = event.clientY;

	var deltaX = newX - lastMouseX;
	var newRotationMatrix = mat4.create();
	mat4.identity(newRotationMatrix);
	mat4.rotate(newRotationMatrix, degToRad(deltaX / 10), [0, 1, 0]);

	var deltaY = newY - lastMouseY;
	mat4.rotate(newRotationMatrix, degToRad(deltaY / 10), [1, 0, 0]);

	mat4.multiply(newRotationMatrix, europaRotationMatrix, ioRotationMatrix);
	mat4.multiply(newRotationMatrix, europaRotationMatrix, europaRotationMatrix);
	mat4.multiply(newRotationMatrix, ganymedeRotationMatrix, ganymedeRotationMatrix);
	mat4.multiply(newRotationMatrix, jupiterRotationMatrix, jupiterRotationMatrix);
	mat4.multiply(newRotationMatrix, saturnRotationMatrix, saturnRotationMatrix);
	mat4.multiply(newRotationMatrix, ringRotationMatrix, ringRotationMatrix);
	mat4.multiply(newRotationMatrix, titanRotationMatrix, titanRotationMatrix);
	mat4.multiply(newRotationMatrix, uranusRotationMatrix, uranusRotationMatrix);
	mat4.multiply(newRotationMatrix, neptuneRotationMatrix, neptuneRotationMatrix);

	lastMouseX = newX;
	lastMouseY = newY;
}

var sphereVertexPositionBuffer;
var sphereVertexNormalBuffer;
var sphereVertexTextureCoordBuffer;
var sphereVertexIndexBuffer;

var starVertexPositionBuffer;
var starVertexTextureCoordBuffer;

function initBuffers() {

	// -------------------- Sphere

	var latitudeBands = 30;
	var longitudeBands = 30;
	var radius = 2;

	var vertexPositionData = [];
	var normalData = [];
	var textureCoordData = [];

	var latNumber, longNumber;

	for (latNumber = 0; latNumber <= latitudeBands; latNumber++) {
		var theta = latNumber * Math.PI / latitudeBands;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		for (longNumber = 0; longNumber <= longitudeBands; longNumber++) {
			var phi = longNumber * 2 * Math.PI / longitudeBands;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);

			var x = cosPhi * sinTheta;
			var y = cosTheta;
			var z = sinPhi * sinTheta;
			var u = 1 - (longNumber / longitudeBands);
			var v = 1 - (latNumber / latitudeBands);

			normalData.push(x);
			normalData.push(y);
			normalData.push(z);
			textureCoordData.push(u);
			textureCoordData.push(v);
			vertexPositionData.push(radius * x);
			vertexPositionData.push(radius * y);
			vertexPositionData.push(radius * z);
		}
	}

	var indexData = [];
	for (latNumber = 0; latNumber < latitudeBands; latNumber++) {
		for (longNumber = 0; longNumber < longitudeBands; longNumber++) {
			var first = (latNumber * (longitudeBands + 1)) + longNumber;
			var second = first + longitudeBands + 1;
			indexData.push(first);
			indexData.push(second);
			indexData.push(first + 1);

			indexData.push(second);
			indexData.push(second + 1);
			indexData.push(first + 1);
		}
	}

	sphereVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
	sphereVertexNormalBuffer.itemSize = 3;
	sphereVertexNormalBuffer.numItems = normalData.length / 3;

	sphereVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
	sphereVertexTextureCoordBuffer.itemSize = 2;
	sphereVertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

	sphereVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
	sphereVertexPositionBuffer.itemSize = 3;
	sphereVertexPositionBuffer.numItems = vertexPositionData.length / 3;

	sphereVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
	sphereVertexIndexBuffer.itemSize = 1;
	sphereVertexIndexBuffer.numItems = indexData.length;

	// -------------------- Stars

	starVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, starVertexPositionBuffer);

	var vertices = [
		1.0,  1.0,  0.0,
		-1.0,  1.0,  0.0,
		1.0, -1.0,  0.0,
		-1.0, -1.0,  0.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	starVertexPositionBuffer.itemSize = 3;
	starVertexPositionBuffer.numItems = 4;

	starVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, starVertexTextureCoordBuffer);

	var textureCoords = [
		0.0 , 0.0 ,
		1.0 , 0.0 ,
		1.0 , 1.0 ,
		0.0 , 1.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	starVertexTextureCoordBuffer.itemSize = 2;
	starVertexTextureCoordBuffer.numItems = 4;
}

var xRot = 0;
var yRot = 0;
var zRot = 0;
var isLighting = true;
var isSpecular = true;
var isBump = false;
var isPhong = true;

function drawScene() {

	var light_z = 2;
	var rho = 0;
	var bump_scale = 45.9;
	var delta_s = 0.005;
	var delta_t = 0.005;
	var texture_coord_scale = 4.2;
	var texture_diffuse_rgba = [1.0, 0.95, 0.5, 1.0];
	var texture_aspect = 1; // not all textures are square, so we need to have a way to accomodate for that

	initShaders();

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 200.0, pMatrix);
	mat4.identity(mvMatrix);

	mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
	mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
	mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);

	gl.uniform1i(shaderProgram.showSpecularHighlightsUniform, isSpecular);

	gl.uniform1i(shaderProgram.useLightingUniform, isLighting);

	if (isLighting) {
		gl.uniform3f(
			shaderProgram.ambientColorUniform,
			parseFloat(document.getElementById("ambientR").value),
			parseFloat(document.getElementById("ambientG").value),
			parseFloat(document.getElementById("ambientB").value)
		);

		gl.uniform3f(
			shaderProgram.pointLightingLocationUniform,
			parseFloat(document.getElementById("lightPositionX").value),
			parseFloat(document.getElementById("lightPositionY").value),
			parseFloat(document.getElementById("lightPositionZ").value)
		);

		gl.uniform3f(
			shaderProgram.pointLightingSpecularColorUniform,
			parseFloat(document.getElementById("specularR").value),
			parseFloat(document.getElementById("specularG").value),
			parseFloat(document.getElementById("specularB").value)
		);

		gl.uniform3f(
			shaderProgram.pointLightingDiffuseColorUniform,
			parseFloat(document.getElementById("diffuseR").value),
			parseFloat(document.getElementById("diffuseG").value),
			parseFloat(document.getElementById("diffuseB").value)
		);
	}

	gl.uniform1i(shaderProgram.useTexturesUniform, 1);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, jupiterTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	gl.uniform1f(shaderProgram.materialShininessUniform, parseFloat(document.getElementById("shininess").value));


	// --------------------------------- Io

	mvPushMatrix();

	mat4.rotate(mvMatrix, degToRad(yRot/2), [0, 1, 0]);
	mat4.translate(mvMatrix, [-2.0, -0.1, -6]);
	mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
	mat4.scale(mvMatrix, [0.08, 0.08, 0.08]);
	mat4.multiply(mvMatrix, ioRotationMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, ioTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	setMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------------------------- Europa

	mvPushMatrix();

	mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
	mat4.translate(mvMatrix, [-50.2, 0.5, -5]);
	mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
	mat4.scale(mvMatrix, [0.05, 0.05, 0.05]);
	mat4.multiply(mvMatrix, europaRotationMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, europaTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	setMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------------------------- Ganymede

	mvPushMatrix();

	mat4.rotate(mvMatrix, degToRad(yRot/8), [0, 1, 0]);
	mat4.translate(mvMatrix, [5.5, -1.5, -8]);
	mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
	mat4.scale(mvMatrix, [0.10, 0.10, 0.10]);
	mat4.multiply(mvMatrix, ganymedeRotationMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, ganymedeTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	setMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------------------------- Jupiter

	mvPushMatrix();

	mat4.translate(mvMatrix, [-0.3, -0.3, -4 ]);
	mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
	mat4.rotate(mvMatrix, degToRad(3.13), [1, 0, 0]);
	mat4.scale(mvMatrix, [0.35, 0.35, 0.35]);
	mat4.multiply(mvMatrix, jupiterRotationMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, jupiterTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	setMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------------------------- Titan

	mvPushMatrix();

	mat4.rotate(mvMatrix, degToRad(yRot/15), [0, 1, 0]);
	mat4.translate(mvMatrix, [1.0, 1.7, -7]);
	mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
	mat4.scale(mvMatrix, [0.04, 0.04, 0.04]);
	mat4.multiply(mvMatrix, titanRotationMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, titanTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	setMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------------------------- Uranus

	mvPushMatrix();

	mat4.translate(mvMatrix, [1.9, 1.7, -9]);
	mat4.rotate(mvMatrix, degToRad(zRot), [0, 0, 1]);
	mat4.rotate(mvMatrix, degToRad(97.77), [1, 0, 0]);
	mat4.scale(mvMatrix, [0.2, 0.2, 0.2]);
	mat4.multiply(mvMatrix, uranusRotationMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, uranusTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	setMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------------------------- Neptune

	mvPushMatrix();

	mat4.translate(mvMatrix, [4.7, 3.2, -13]);
	mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
	mat4.rotate(mvMatrix, degToRad(28.32), [1, 0, 0]);
	mat4.scale(mvMatrix, [0.22, 0.22, 0.22]);
	mat4.multiply(mvMatrix, neptuneRotationMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, neptuneTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	setMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------------------------- Stars

	mvPushMatrix();

	mat4.translate(mvMatrix, [0, 0, -15]);
	mat4.scale(mvMatrix, [70, 70, 70]);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, starTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	setMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------------------------- Rings

	mvPushMatrix();

	mat4.translate(mvMatrix, [0.2, 1.0, -8]);

	//mat4.rotate(mvMatrix, degToRad(xRot), [1, 0, 0]);
	mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
	//mat4.rotate(mvMatrix, degToRad(zRot), [0, 0, 1]);

	mat4.rotate(mvMatrix, degToRad(116.73), [1, 0, 0]);

	mat4.scale(mvMatrix, [0.65, 0.65, 0.001]);

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, ringTexture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	setMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	gl.disable(gl.BLEND);
	gl.enable(gl.DEPTH_TEST);

	mvPopMatrix();

	// ------------------------------------- Bump Saturn

	if (isBump){

		mvPushMatrix();

		bumpInitShaders();

		mat4.translate(mvMatrix, [0.2, 1.0, -8]);
		mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
		mat4.rotate(mvMatrix, degToRad(26.73), [1, 0, 0]);
		mat4.scale(mvMatrix, [0.5, 0.5, 0.5]);
		mat4.multiply(mvMatrix, saturnRotationMatrix);

		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
		gl.vertexAttribPointer(bumpShaderProgram.bumpVertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
		gl.vertexAttribPointer(bumpShaderProgram.bumpVextureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, saturnTexture);
		gl.uniform1i(bumpShaderProgram.samplerUniform, 0);

		gl.uniform1f(bumpShaderProgram.light_z, light_z);
		gl.uniform1f(bumpShaderProgram.rho, rho);
		gl.uniform1f(bumpShaderProgram.bump_scale, bump_scale);
		gl.uniform1f(bumpShaderProgram.delta_s, delta_s);
		gl.uniform1f(bumpShaderProgram.delta_t, delta_t);
		gl.uniform1f(bumpShaderProgram.texture_coord_scale, texture_coord_scale);
		gl.uniform1f(bumpShaderProgram.viewport_aspect, gl.viewportWidth / gl.viewportHeight);
		gl.uniform4f(bumpShaderProgram.diffuse_material, texture_diffuse_rgba[0], texture_diffuse_rgba[1], texture_diffuse_rgba[2], texture_diffuse_rgba[3]);
		gl.uniform1f(bumpShaderProgram.texture_aspect, texture_aspect);

		bumpSetMatrixUniforms();

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
		gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

		initShaders();

		mvPopMatrix();

	} else if(!isBump){

		mvPushMatrix();

		mat4.translate(mvMatrix, [0.2, 1.0, -8]);
		mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
		mat4.rotate(mvMatrix, degToRad(26.73), [1, 0, 0]);
		mat4.scale(mvMatrix, [0.5, 0.5, 0.5]);

		mat4.multiply(mvMatrix, saturnRotationMatrix);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, saturnTexture);
		gl.uniform1i(shaderProgram.samplerUniform, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

		setMatrixUniforms();

		gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

		mvPopMatrix();
	}

	document.getElementById('lighting').onclick = function() {
		isLighting = !isLighting;
		if(isBump == true && isLighting == false) isBump = false;
	};
	document.getElementById('specular').onclick = function() {
		isSpecular = !isSpecular;
	};
	document.getElementById('bump').onclick = function() {
		isBump = !isBump;
	};
	document.getElementById('phong').onclick = function() {
		isPhong = !isPhong;
	};
}

function drawScenePointLight() {

	var light_z = 2;
	var rho = 0;
	var bump_scale = 45.9;
	var delta_s = 0.005;
	var delta_t = 0.005;
	var texture_coord_scale = 4.2;
	var texture_diffuse_rgba = [1.0, 1.0, 0.5, 1.0];
	var texture_aspect = 1; // not all textures are square, so we need to have a way to accomodate for that

	pointLightInitShaders();

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 200.0, pMatrix);
	mat4.identity(mvMatrix);

	mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
	mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
	mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);

	gl.uniform1i(pointShaderProgram.useLightingUniform, isLighting);
	if (isLighting) {
		gl.uniform3f(
			pointShaderProgram.ambientColorUniform,
			parseFloat(document.getElementById("ambientR").value),
			parseFloat(document.getElementById("ambientG").value),
			parseFloat(document.getElementById("ambientB").value)
		);

		gl.uniform3f(
			pointShaderProgram.pointLightingLocationUniform,
			parseFloat(document.getElementById("lightPositionX").value),
			parseFloat(document.getElementById("lightPositionY").value),
			parseFloat(document.getElementById("lightPositionZ").value)
		);

		gl.uniform3f(
			pointShaderProgram.pointLightingLocationUniform2,
			10,
			5,
			-15
		);

		gl.uniform3f(
			pointShaderProgram.pointLightingColorUniform,
			parseFloat(document.getElementById("pointR").value),
			parseFloat(document.getElementById("pointG").value),
			parseFloat(document.getElementById("pointB").value)
		);
	}
	gl.uniform1i(pointShaderProgram.useTexturesUniform, 1);

	// --------------------------------- Io

	mvPushMatrix();

	mat4.rotate(mvMatrix, degToRad(yRot/2), [0, 1, 0]);
	mat4.translate(mvMatrix, [-2.0, -0.1, -6]);
	mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
	mat4.scale(mvMatrix, [0.08, 0.08, 0.08]);
	mat4.multiply(mvMatrix, ioRotationMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, ioTexture);
	gl.uniform1i(pointShaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(pointShaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	pointSetMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------------------------- Europa

	mvPushMatrix();

	mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
	mat4.translate(mvMatrix, [-50.2, 0.5, -5]);
	mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
	mat4.scale(mvMatrix, [0.05, 0.05, 0.05]);
	mat4.multiply(mvMatrix, europaRotationMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, europaTexture);
	gl.uniform1i(pointShaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(pointShaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	pointSetMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------------------------- Ganymede

	mvPushMatrix();

	mat4.rotate(mvMatrix, degToRad(yRot/8), [0, 1, 0]);
	mat4.translate(mvMatrix, [5.5, -1.5, -8]);
	mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
	mat4.scale(mvMatrix, [0.10, 0.10, 0.10]);
	mat4.multiply(mvMatrix, ganymedeRotationMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, ganymedeTexture);
	gl.uniform1i(pointShaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(pointShaderProgram.textureCoordAttribute,sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	pointSetMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------------------------- Jupiter

	mvPushMatrix();

	mat4.translate(mvMatrix, [-0.3, -0.3, -4]);
	mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
	mat4.rotate(mvMatrix, degToRad(3.13), [1, 0, 0]);
	mat4.scale(mvMatrix, [0.35, 0.35, 0.35]);
	mat4.multiply(mvMatrix, jupiterRotationMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, jupiterTexture);
	gl.uniform1i(pointShaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(pointShaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	pointSetMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------------------------- Titan

	mvPushMatrix();

	mat4.rotate(mvMatrix, degToRad(yRot/15), [0, 1, 0]);
	mat4.translate(mvMatrix, [1.0, 1.7, -7]);
	mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
	mat4.scale(mvMatrix, [0.04, 0.04, 0.04]);
	mat4.multiply(mvMatrix, titanRotationMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, titanTexture);
	gl.uniform1i(pointShaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(pointShaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	pointSetMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------------------------- Uranus

	mvPushMatrix();

	mat4.translate(mvMatrix, [1.9, 1.7, -9]);
	mat4.rotate(mvMatrix, degToRad(zRot), [0, 0, 1]);
	mat4.rotate(mvMatrix, degToRad(97.77), [1, 0, 0]);
	mat4.scale(mvMatrix, [0.2, 0.2, 0.2]);
	mat4.multiply(mvMatrix, uranusRotationMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, uranusTexture);
	gl.uniform1i(pointShaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(pointShaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	pointSetMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------------------------- Neptune

	mvPushMatrix();

	mat4.translate(mvMatrix, [4.7, 3.2, -13]);
	mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
	mat4.rotate(mvMatrix, degToRad(28.32), [1, 0, 0]);
	mat4.scale(mvMatrix, [0.22, 0.22, 0.22]);
	mat4.multiply(mvMatrix, neptuneRotationMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, neptuneTexture);
	gl.uniform1i(pointShaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(pointShaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	pointSetMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------------------------- Stars

	mvPushMatrix();

	mat4.translate(mvMatrix, [0, 0, -15]);
	mat4.scale(mvMatrix, [70, 70, 70]);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, starTexture);
	gl.uniform1i(pointShaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(pointShaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	pointSetMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	mvPopMatrix();

	// --------------------------------- Rings

	mvPushMatrix();

	mat4.translate(mvMatrix, [0.2, 1.0, -8]);
	mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
	mat4.rotate(mvMatrix, degToRad(116.73), [1, 0, 0]);
	mat4.scale(mvMatrix, [0.65, 0.65, 0.001]);

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, ringTexture);
	gl.uniform1i(pointShaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
	gl.vertexAttribPointer(pointShaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
	gl.vertexAttribPointer(pointShaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

	pointSetMatrixUniforms();

	gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

	gl.disable(gl.BLEND);
	gl.enable(gl.DEPTH_TEST);

	mvPopMatrix();

	// ------------------------------------- Bump Saturn

	if (isBump){

		mvPushMatrix();

		bumpInitShaders();

		mat4.translate(mvMatrix, [0.2, 1.0, -8]);
		mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
		mat4.rotate(mvMatrix, degToRad(26.73), [1, 0, 0]);
		mat4.scale(mvMatrix, [0.5, 0.5, 0.5]);
		mat4.multiply(mvMatrix, saturnRotationMatrix);

		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
		gl.vertexAttribPointer(bumpShaderProgram.bumpVertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
		gl.vertexAttribPointer(bumpShaderProgram.bumpVextureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, saturnTexture);
		gl.uniform1i(bumpShaderProgram.samplerUniform, 0);

		gl.uniform1f(bumpShaderProgram.light_z, light_z);
		gl.uniform1f(bumpShaderProgram.rho, rho);
		gl.uniform1f(bumpShaderProgram.bump_scale, bump_scale);
		gl.uniform1f(bumpShaderProgram.delta_s, delta_s);
		gl.uniform1f(bumpShaderProgram.delta_t, delta_t);
		gl.uniform1f(bumpShaderProgram.texture_coord_scale, texture_coord_scale);
		gl.uniform1f(bumpShaderProgram.viewport_aspect, gl.viewportWidth / gl.viewportHeight);
		gl.uniform4f(bumpShaderProgram.diffuse_material, texture_diffuse_rgba[0], texture_diffuse_rgba[1], texture_diffuse_rgba[2], texture_diffuse_rgba[3]);
		gl.uniform1f(bumpShaderProgram.texture_aspect, texture_aspect);

		bumpSetMatrixUniforms();

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
		gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

		pointLightInitShaders();

		mvPopMatrix();

	} else if(!isBump){

		mvPushMatrix();

		mat4.translate(mvMatrix, [0.2, 1.0, -8]);
		mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
		mat4.rotate(mvMatrix, degToRad(26.73), [1, 0, 0]);
		mat4.scale(mvMatrix, [0.5, 0.5, 0.5]);
		mat4.multiply(mvMatrix, saturnRotationMatrix);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, saturnTexture);
		gl.uniform1i(pointShaderProgram.samplerUniform, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
		gl.vertexAttribPointer(pointShaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
		gl.vertexAttribPointer(pointShaderProgram.textureCoordAttribute, sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
		gl.vertexAttribPointer(pointShaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

		pointSetMatrixUniforms();

		gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

		mvPopMatrix();
	}

	document.getElementById('bump').onclick = function() {
		isBump = !isBump;
		if(isBump == true && isLighting == false) isBump = false;
	};
	document.getElementById('lighting').onclick = function() {
		isLighting = !isLighting;
	};
	document.getElementById('phong').onclick = function() {
		isPhong = !isPhong;
	};
}

var prevTime = 0;
var joggingAngle = 0;

function animate() {
	var timeNow = new Date().getTime();
	if (prevTime != 0) {
		var elapsed = timeNow - prevTime ;
		if (speed != 0) {
			xPos -= Math.sin(degToRad(yaw)) * speed * elapsed;
			zPos -= Math.cos(degToRad(yaw)) * speed * elapsed;

			joggingAngle += elapsed * 0.6;
			yPos = Math.sin(degToRad(joggingAngle)) / 20 + 0.4
		}

		yaw += yawRate * elapsed;
		pitch += pitchRate * elapsed;

		xRot += (70 * elapsed ) / 3000.0;
		yRot += (70 * elapsed ) / 3000.0;
		zRot += (70 * elapsed ) / 3000.0;
	}
	prevTime = timeNow;
}

function draw() {
	requestAnimFrame(draw);
	handleKeys();

	if(isPhong){
		drawScene();
	}
	else if (!isPhong){
		drawScenePointLight();
	}
	animate();
}

function webGLStart() {
	var canvas = document.getElementById("gl-canvas");
	initGL(canvas);
	initTexture();
	initBuffers();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;

	draw();
}