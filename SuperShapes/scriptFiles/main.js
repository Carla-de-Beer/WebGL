	'use strict';

	var gl;

	function initGL(canvas) {
		try {
			gl = canvas.getContext("experimental-webgl");
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
		} catch (e) {
		}
		if (!gl) {
			alert("Could not initialise WebGL");
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
		if (shaderScript.type === "x-shader/x-fragment") {
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		} else if (shaderScript.type === "x-shader/x-vertex") {
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

		shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
		gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

		shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
		shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
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
		if (mvMatrixStack.length === 0) {
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

	function degToRad(degrees) {
		return degrees * Math.PI / 180;
	}

	var mouseDown = false;
	var lastMouseX = null;
	var lastMouseY = null;

	var sphereRotationMatrix = mat4.create();
	mat4.identity(sphereRotationMatrix);

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

		mat4.multiply(newRotationMatrix, sphereRotationMatrix, sphereRotationMatrix);

		lastMouseX = newX;
		lastMouseY = newY;
	}

	var sphereVertexPositionBuffer;
	var sphereVertexNormalBuffer;
	var sphereVertexIndexBuffer;
	var sphereVertexColorBuffer;

	var m_lat = 6;
	var n1_lat = 250;
	var n2_lat = 100;
	var n3_lat = 100;
	var a_lat = 1.00;
	var b_lat = 1.00;

	var m_lon = 6;
	var n1_lon = 60;
	var n2_lon = 55;
	var n3_lon = 1000;
	var a_lon = 1.00;
	var b_lon = 1.00;

	var xRot = 0;
	var yRot = 0;
	var zRot = 0;

	var mChange = 0.0;
	var zValue = -6;

	var isTranslatedBack = true;
	var isTranslatedForward = true;

	function initBuffers() {
		var latitudeBands = 35;
		var longitudeBands = 35;
		var radius = 2;

		var vertexPositionData = [];
		var normalData = [];

		//m_lat = mapping(Math.sin(mChange), -1, 1, 0, 7);
		//m_lon = mapping(Math.sin(mChange), -1, 1, 0, 7);


		for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
			var theta = mapping(latNumber, 0, latitudeBands - 1, -Math.PI/2, Math.PI/2);
			var r1 = superShape(theta, m_lat, n1_lat, n2_lat, n3_lat, a_lat, b_lat);

			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);

			for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
				var phi = mapping(longNumber, 0, longitudeBands - 1, -Math.PI, Math.PI);
				var r2 = superShape(phi, m_lon, n1_lon, n2_lon, n3_lon, a_lon, b_lon);

				var sinPhi = Math.sin(phi);
				var cosPhi = Math.cos(phi);

				var x = radius * r2 * cosPhi * r1 * cosTheta;
				var y = radius * r2 * sinPhi * r1 * cosTheta;
				var z = radius * r1 * sinTheta;

				normalData.push(x);
				normalData.push(y);
				normalData.push(z);
				vertexPositionData.push(radius * x);
				vertexPositionData.push(radius * y);
				vertexPositionData.push(radius * z);
			}
		}

		var indexData = [];
		for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
			for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
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

		var color1 = [0.7, 0.2, 0.2, 1.0];
		var color2 = [1.0, 1.0, 0.2, 1.0];

		var unpackedColors = [];

		for (var i = 0; i < vertexPositionData.length; i++) {
			if (i % 2 === 0) {
				unpackedColors = unpackedColors.concat(color1);
			} else
				unpackedColors = unpackedColors.concat(color2);
		}

		sphereVertexNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
		sphereVertexNormalBuffer.itemSize = 3;
		sphereVertexNormalBuffer.numItems = normalData.length / 3;

		sphereVertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
		sphereVertexPositionBuffer.itemSize = 3;
		sphereVertexPositionBuffer.numItems = vertexPositionData.length / 3;

		sphereVertexColorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
		sphereVertexColorBuffer.itemSize = 3;
		sphereVertexColorBuffer.numItems = vertexPositionData.length / 3;

		sphereVertexIndexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
		sphereVertexIndexBuffer.itemSize = 1;
		sphereVertexIndexBuffer.numItems = indexData.length;
	}

	function superShape(theta, m, n1, n2, n3, a, b) {
		var t1 = Math.abs((1/a) * Math.cos(m * theta/4));
		t1 = Math.pow(t1, n2);
		var t2 = Math.abs((1/b) * Math.sin(m * theta/4));
		t2 = Math.pow(t2, n3);
		var t3 = t1 + t2;
		return Math.pow(t3, -1/n1);
	}

	function mapping(tu, tu_min, tu_max, ts_min, ts_max) {
		return ((tu - tu_min)/(tu_max - tu_min)) * (ts_max - ts_min) + ts_min;
	}

	function drawScene() {

		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		if (isTranslatedBack) {
			document.getElementById('translateBackButton').onclick = function() {
				zValue -= 0.5;

			}
		}

		if (isTranslatedForward) {
			document.getElementById('translateForwardButton').onclick = function() {
				zValue += 0.5;

			}
		}

		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, [0, 0, zValue]);
		mat4.multiply(mvMatrix, sphereRotationMatrix);
		mat4.scale(mvMatrix, [0.5, 0.5, 0.5]);
		mat4.rotate(mvMatrix, degToRad(xRot/2), [1, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(yRot/2), [0, 1, 0]);
		mat4.rotate(mvMatrix, degToRad(zRot/2), [0, 0, 1]);

		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, sphereVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);

		setMatrixUniforms();

		gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}

	var prevTime = 0;

	function animate() {
		var timeNow = new Date().getTime();
		if (prevTime !== 0) {
			xRot += 0.1;
			yRot += 0.1;
			zRot += 0.1;
		}
		prevTime = timeNow;
	}

	function tick() {
		requestAnimFrame(tick);
		drawScene();
		animate();
	}

	function webGLStart() {
		var canvas = document.getElementById("gl-canvas");
		initGL(canvas);
		initShaders();
		initBuffers();

		gl.clearColor(0.15, 0.15, 0.15, 1.0);
		gl.enable(gl.DEPTH_TEST);

		canvas.onmousedown = handleMouseDown;
		document.onmouseup = handleMouseUp;
		document.onmousemove = handleMouseMove;

		tick();
	}
